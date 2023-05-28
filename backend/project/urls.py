from .views import signin, signup, get_profile, signout
from django.urls import re_path, include
from ETL.urls import router

urlpatterns = [
    re_path('api/', include(router.urls)),
    re_path('signin', signin),
    re_path('signup', signup),
    re_path('signout', signout),
    re_path('profile', get_profile),
]
