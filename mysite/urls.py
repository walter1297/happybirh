"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("birth.urls")),
    # 嗯，阅读了django的官方文档，一个include函数也大有深意，用自己的理解就是，把django应用中的url地址插入到全局地址之中，这种分层开发而不依赖于全局更有效率。
    # 还了解到了原来列表里可以包含函数
    # python会对这个列表执行什么操作呢？
    path('admin/', admin.site.urls),
]
