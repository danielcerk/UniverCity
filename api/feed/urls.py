from django.urls import path

from .views import FeedView

urlpatterns = [
    
    path('feed/<int:id>', FeedView.as_view(), name='feed-user')

]
