from .viewsets import CsvFileViewSet, TransformationViewSet
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'files', CsvFileViewSet, basename='files')
router.register(r'transformations', TransformationViewSet, basename='transformations')