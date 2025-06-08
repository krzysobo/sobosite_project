import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone as django_tz
from enum import Enum



# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    STATUS_UNDEFINED = 0  # TODO unused yet
    STATUS_NEW = 10       # used
    STATUS_REJECTED = 15  # TODO unused yet
    STATUS_ACCEPTED = 20  # used
    STATUS_DELETED = -1   # TODO unused yet
    
    class UserRoleE(models.TextChoices):
        USER = "USR", "Common User"
        ADMIN = "ADM", "ADMIN"


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=django_tz.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    email = models.EmailField(unique=True, null=False)
    first_name = models.CharField(max_length=255, null=True, blank=True, unique=False)
    last_name = models.CharField(max_length=255, null=True,  blank=True, unique=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    # role = models.CharField(max_length=3, choices=UserRoleE.choices, default=UserRoleE.USER, db_index=True)

    register_activation_token = models.CharField(max_length=600, null=True,  unique=True)
    password_reset_token = models.CharField(max_length=600, null=True,  unique=True)
    password_reset_token_valid_thru = models.DateTimeField(null=True)

    no_failed_logins = models.SmallIntegerField(blank=True, default=0)
    failed_is_blocked = models.BooleanField(default=False)
    failed_is_blocked_thru = models.DateTimeField(null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        if self.full_name:
            return f'{self.full_name} ({self.email})'
        else:
            return self.email
        
    def __repr__(self):
        return self.__str__()
    
    @property 
    def status(self):
        if self.is_active:
            return self.STATUS_ACCEPTED
        else:
            return self.STATUS_NEW

    @property 
    def role(self):
        if self.is_staff:
            return self.UserRoleE.ADMIN.value
        else:
            return self.UserRoleE.USER.value

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            res = f'{self.first_name} {self.last_name}'
        elif self.first_name:
            res = self.first_name
        elif self.last_name:
            res = self.last_name
        else:
            res = ""
        return res
    
    @property
    def full_name_with_email(self):
        fn = self.full_name
        return f"{fn} ({self.email})"

    

    # class Meta:
    #     db_table = "user"