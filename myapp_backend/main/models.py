from django.db import models

# Create your models here.
class Client(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=20)
    email = models.CharField(max_length=30)
    def __str__(self) -> str:
        return self.phone_number

class Service(models.Model):
    name = models.CharField(max_length=50)
    price = models.PositiveIntegerField()
    duration = models.DurationField()
    def __str__(self):
        return (self.name)

class Location(models.Model):
    name = models.CharField(max_length=30)
    address = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    open_time = models.TimeField()
    close_time = models.TimeField()
    def __str__(self):
        return (self.name)

class Employee(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)  
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    daysOfWeek = models.JSONField(blank=True, null=True)
    # off_days = models.DateField(blank=True, null=True)
    def __str__(self):
        return (self.first_name)    

    
class Appointment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    day = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    cancelled = models.BooleanField(default=False)
    
    def __str__(self):
        return "{} {} {}".format(self.start_time, self.end_time, self.day)

    
    
    
    
