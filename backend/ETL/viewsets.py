from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from .serializers import CsvFileSerializer, TransformationSerializer
from .models import CsvFiles, Transformations
from project.settings import BASE_DIR
from rest_framework.decorators import action
import os

from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, ParseError, APIException
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from django.http import HttpResponse
from django.core.files.storage import default_storage

import pandas as pd

class InvalidData(APIException):
    status_code = 400
    default_detail = 'Invalid data.'
    default_code = 'invalid_data'

# helper
def clean_currency(x):
    """ If the value is a string, then remove currency symbol and delimiters
    otherwise, the value is numeric and can be converted
    """
    if isinstance(x, str):
        return(x.replace('$', '').replace(',', ''))
    return(x)

class CsvFileViewSet(ModelViewSet):
    serializer_class = CsvFileSerializer
    parser_class = (FileUploadParser,)
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CsvFiles.objects.filter(user=self.request.user)

    def create(self, request):
        try:
            data = request.data.copy()
            data['user'] = request.user.id
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                csv_file_instance = serializer.save()
                # retrieve the newly saved CSV file instance and serialize it using the same serializer:
                serializer = self.get_serializer(csv_file_instance)
                return Response(serializer.data, status=201)
            else:
                raise InvalidData(serializer.errors)
        except ParseError as e:
            raise InvalidData(str(e))
        
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            file = get_object_or_404(CsvFiles, id=pk, user=request.user)
            # Define the full file path
            file_path = os.path.join(BASE_DIR, file.file.path)
            # Retrieve the CSV file from storage
            csv_file = default_storage.open(file_path)
            
            # Read the contents of the file
            file_contents = csv_file.read()
            
            # Return a response object with the file contents and appropriate content type
            response = HttpResponse(file_contents, content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{file.file.path}"'
            return response
        except CsvFiles.DoesNotExist:
            raise NotFound('CSV file not found.')
            
    def destroy(self, request, pk=None):
        try:
            # Get the CSV file object to be deleted
            file = CsvFiles.objects.get(id=pk, user=request.user)
            # Get the full file path and delete the file from storage
            file_path = os.path.join(BASE_DIR, file.file.path)
            default_storage.delete(file_path)
            # Call the parent class's destroy method to delete the file object from the database
            super().destroy(request, pk)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CsvFiles.DoesNotExist:
            raise NotFound('CSV file not found.')

    @action(detail=True, methods=['get'])
    def get_csv_content(self, request, pk=None):
        try:
            file = get_object_or_404(CsvFiles, id=pk, user=request.user)
            # Define the full file path
            file_path = os.path.join(BASE_DIR, file.file.path)
            # Read the CSV file with pandas
            df = pd.read_csv(file_path)

            # Check for missing data
            df['Missing'] = df.isnull().any(axis=1).astype(int)

            # Check for duplicated data
            df['Duplicated'] = df.duplicated().astype(int)
            
            # Convert the DataFrame to a dictionary
            data_dict = df.to_json(orient='records')
            
            return Response(data_dict, content_type='application/json')
        except CsvFiles.DoesNotExist:
            raise NotFound('CSV file not found.')
        
    @action(detail=True, methods=['post'])
    def apply_transformation(self, request, pk=None):
        try:
            file = get_object_or_404(CsvFiles, id=pk, user=request.user)
            # Define the full file path
            file_path = os.path.join(BASE_DIR, file.file.path)
            # Read the CSV file with pandas
            df = pd.read_csv(file_path)
            
            operation_type = request.data.get('operator', None)
            value_to_apply = request.data.get('value', None)
            column_name = request.data.get('column_name', None)

            # Validate the input parameters
            if not all([operation_type, value_to_apply, column_name]):
                raise ValueError('Please provide valid values for operation_type, value_to_apply and column_name')
            
            
            # this line turn currency into float so we can apply operations on them
            df[column_name] = df[column_name].apply(clean_currency).astype('float')

            # Apply the arithmetic operation on the specified column
            if operation_type == '+':
                df[column_name] = df[column_name].astype('float').apply(lambda x: x + float(value_to_apply))
            elif operation_type == '-':
                df[column_name] = df[column_name].astype('float').apply(lambda x: x - float(value_to_apply))
            elif operation_type == '*':
                df[column_name] = df[column_name].astype('float').apply(lambda x: x * float(value_to_apply))
            elif operation_type == '/':
                df[column_name] = df[column_name].astype('float').apply(lambda x: x / float(value_to_apply))
            else:
                raise ValueError('Invalid operation_type provided')
            
            
            # Check for missing data
            df['Missing'] = df.isnull().any(axis=1).astype(int)

            # Check for duplicated data
            df['Duplicated'] = df.duplicated().astype(int)

            # Convert the DataFrame to a dictionary
            data_dict = df.to_json(orient='records')
            
            return Response(data_dict, content_type='application/json')
        except CsvFiles.DoesNotExist:
            raise NotFound('CSV file not found.')
    @action(detail=True, methods=['post'])
    def eval_transformation(self, request, pk=None):
        try:
            file = get_object_or_404(CsvFiles, id=pk, user=request.user)
            # Define the full file path
            file_path = os.path.join(BASE_DIR, file.file.path)
            # Read the CSV file with pandas
            df = pd.read_csv(file_path)
            df.columns = [c.replace(' ', '_') for c in df.columns]
            operation = request.data.get('operation', None)

            # Validate the input parameters
            if not operation:
                raise ValueError('Please provide valid values for operation')
            
            eval_res = df.eval(operation)
            # Check for missing data
            eval_res['Missing'] = eval_res.isnull().any(axis=1).astype(int)

            # Check for duplicated data
            eval_res['Duplicated'] = eval_res.duplicated().astype(int)

            return Response(eval_res.to_json(orient='records'), content_type='application/json')
        except CsvFiles.DoesNotExist:
            raise NotFound('CSV file not found.')

class TransformationViewSet(ModelViewSet):
    serializer_class = TransformationSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transformations.objects.filter(user=self.request.user)

    def create(self, request):
        try:
            data = request.data.copy()
            data['user'] = request.user.id
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                transformation_instance = serializer.save()
                # retrieve the newly saved CSV file instance and serialize it using the same serializer:
                serializer = self.get_serializer(transformation_instance)
                return Response(serializer.data, status=201)
            else:
                raise InvalidData(serializer.errors)
        except ParseError as e:
            raise InvalidData(str(e))
        
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            transformation = get_object_or_404(Transformations, id=pk, user=request.user)
            return Response(self.get_serializer(transformation).data)
        except CsvFiles.DoesNotExist:
            raise NotFound('CSV file not found.')
            
    def destroy(self, request, pk=None):
        try:
            transformation = get_object_or_404(Transformations, id=pk, user=request.user)
            transformation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CsvFiles.DoesNotExist:
            raise NotFound('CSV file not found.')
