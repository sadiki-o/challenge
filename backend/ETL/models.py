from django.db import models
from django.contrib.auth.models import User

# Define the model for storing CSV files
class CsvFiles(models.Model):
    # Add fields to store the details of the CSV file
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='csv_files/')
    
    # Add a ForeignKey to User so that each csv file belongs to a user
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Add a timestamp field to store the time when the CSV file was added
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "CSV Files"
        

# Define the model for storing ETL transformations
class Transformations(models.Model):
    # Add fields to store the details of the transformation
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    transformation_code = models.TextField(unique=True)

    # Add a ForeignKey to User so that each transformation belongs to a user
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Add a timestamp field to store the time when the transformation was added
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Transformations"