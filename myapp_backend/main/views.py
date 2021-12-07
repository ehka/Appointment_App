from collections import defaultdict
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Appointment, Client, Service, Location, Employee
from django.forms.models import model_to_dict
from datetime import datetime, timedelta, date
from .serializers import AppointmentSerializer, ClientSerializer, LocationSerializer, ServiceSerializer
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@api_view(['GET'])
def getLocationsAndServices(request):
    locations = Location.objects.all()
    services = Service.objects.all()
    locationSerializer = LocationSerializer(locations, context={'request': request}, many=True)
    serviceSerializer = ServiceSerializer(services, context={'request': request}, many=True)
    res = {}
    res["locationInfo"] = locationSerializer.data
    res["serviceInfo"] = serviceSerializer.data
    return Response(res)
    

@api_view(['GET'])
def availability_list(request):
    print(request.GET.get('location', ''))
    if request.method != 'GET':
        return Response("error", status=status.HTTP_400_BAD_REQUEST)
    location = request.GET.get('location', '')
    day = request.GET.get('day', '')
    service = request.GET.get('service', '')
    if not location or not day or not service:
        return Response("bad request", status=status.HTTP_400_BAD_REQUEST)
    
    appointments = _get_appointments(location, day)
    employees = _get_employees(location, day)
    service_duration = _get_service_duration(service)
    open_time, close_time = _get_hours(location)
    
    emp_dict, emp_info = _get_Apps_For_Employees(appointments, employees)
    openTimes = _computeOpenSlots(emp_dict, open_time, close_time, service_duration)
    res = {}
    res["employeeInfo"] = emp_info
    res["openTimes"] = openTimes
    return Response(res)

@csrf_exempt
@api_view(['POST'])    
def reserve(request):
    data = JSONParser().parse(request)
    print(data)
    # Data
    clientData = data["client"]
    serviceData = data["service"]
    reservationData = data["reservation"]

    # Save client data
    clientSerializer = ClientSerializer(data=clientData)
    if not Client.objects.filter(phone_number=clientData["phone_number"], email=clientData["email"]) and clientSerializer.is_valid():
        print("valid client")
        clientSerializer.save()

    # Objects
    clientObj = Client.objects.get(phone_number=clientData["phone_number"], email=clientData["email"])
    serviceObj = Service.objects.get(name=serviceData["name"])
    locationObj = Location.objects.get(name=serviceData["location"])
    employeeObj = Employee.objects.get(id=reservationData["employee_id"])
    print(locationObj, locationObj.id)
    # Save appointment Data
    appObject = {
        "employee": employeeObj.id,
        "client": clientObj.id,
        "location": locationObj.id,
        "service": serviceObj.id,
        "day": serviceData["date"],
        "start_time": reservationData["start_time"],
        "end_time": reservationData["end_time"],
        "cancelled": False,    
    }
    appointmentSerializer = AppointmentSerializer(data=appObject)
    if appointmentSerializer.is_valid():
        print("valid Appointment")
        appointmentSerializer.save()
        return Response(status=status.HTTP_201_CREATED)
    print(appointmentSerializer.errors)
    return Response(appointmentSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# @csrf_exempt
# @api_view(['POST'])    
# def addClient(request):
#     data = JSONParser().parse(request)
#     # new_data = create_appObject(data)
#     print(data)

#     clientSerializer = ClientSerializer(data=data)
#     if clientSerializer.is_valid():
#         clientSerializer.save()
#         return Response(status=status.HTTP_201_CREATED)
#     return Response(clientSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

def _get_appointments(location, day):
    res = []
    location_id = Location.objects.filter(name=location).values_list("id", flat=True)[0]
    data = Appointment.objects.filter(location_id = location_id, day = day)
    for val in data:
        res.append(val) 
    return res

def _get_employees(location, day):
    res = []
    location_id = Location.objects.filter(name=location).values_list("id", flat=True)[0]
    employees = Employee.objects.filter(location_id = location_id)
    dateTime = datetime.strptime(day, '%Y-%m-%d').date()
    day_of_week = dateTime.weekday()
    
    for emp in employees.iterator():
        work_days = getattr(emp, "daysOfWeek")
        
        if not work_days or day_of_week not in work_days:
            continue
        res.append(emp) 
    return res

def _get_service_duration(service):
    obj = Service.objects.filter(name=service)[0]
    duration = getattr(obj, "duration")
    return duration

def _get_hours(location):
    obj = Location.objects.filter(name=location)[0]
    open_time = getattr(obj, "open_time")
    close_time = getattr(obj, "close_time")
    return (open_time, close_time)

def _get_Apps_For_Employees(appointments, employees):
    res = {}
    employee_info = {}
    for emp in employees:
        name = getattr(emp, "first_name") + " " + getattr(emp, "last_name")[0:1]
        key = getattr(emp, "id")
        res[key] = []
        employee_info[key] = {}
        employee_info[key]["name"] = name

    for app in appointments:
        employee = getattr(app, "employee_id")
        start_time, end_time = getattr(app, "start_time"), getattr(app, "end_time")
        key = getattr(emp, "id")
        res[key].append((start_time, end_time)) 
      
    return res, employee_info

def _computeOpenSlots(emp_dict, open_time, close_time, service_duration):
    res = {}
    for emp in emp_dict:
        open_slots = []
        arr = emp_dict[emp]
        arr.sort()
        start = open_time
        for left, right in arr:
            if left > start:
                open_slots.append((start, left))
            start = right
        if close_time > start:
            open_slots.append((start, close_time))
        
        if open_slots:
            res[emp] = []
            for left, right in open_slots:
                start = left
                while addTime(start, service_duration) <= right:
                    res[emp].append((start, addTime(start, service_duration)))
                    start = addTime(start, timedelta(minutes=30))
                
    print(res)
    return res

def addTime(time1, delta):
    temp_time = datetime.combine(date(1,1,1), time1)
    res = (temp_time + delta).time()
    return res

# def create_appObject(data):
#     new_data = {}
#     new_data["start_time"], new_data["end_time"] = data["time"][0], data["time"][1]
#     new_data["employee_id"] = data["employee"]
#     new_data["service_id"] = Service.objects.filter(name=data["service"]).values_list("id", flat=True)[0]
#     new_data["client_id"] = data["client"]
#     new_data["day"] = data["day"]
#     return new_data
        
    