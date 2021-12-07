from django.db.models import fields
from rest_framework import serializers
from .models import Appointment, Client, Location, Service

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ('pk', 'employee', 'client', 'location', 'day', 'start_time', 'end_time', 'service', 'cancelled')

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ("first_name", "last_name", "phone_number", "email")

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ("name", "address", "phone_number", "open_time", "close_time")

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ("name", "price","duration")
        