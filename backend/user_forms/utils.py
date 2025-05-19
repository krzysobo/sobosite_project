import smtplib, ssl
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import datetime as dt
from django.shortcuts import render
from django.core.exceptions import PermissionDenied
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

import user_forms.serializers as sers
import user_forms.models as models
import user_forms.utils as utils 


# import pytz
# from django.http import Http404, JsonResponse
# from django.contrib.auth import get_user_model, update_session_auth_hash
# from django.contrib.auth import authenticate
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import user_forms.perms as perms 
from django.conf import settings


def uni_response(data={}, errors={}, status=200): 
    return Response({"data": data, "errors": errors}, status=status)


def serialize_error_data(serializer_errors):
    errors_out = {}
    all_error_codes = set()
    for err_group in serializer_errors:
        err_list_serialized = []
        for err_item in serializer_errors[err_group]:
            print(f"ERR group {err_group} item: code: {err_item.code} item: ", str(err_item))
            err_list_serialized.append((err_item.code, str(err_item)))
            all_error_codes.add(err_item.code)
        errors_out[err_group] = err_list_serialized    
    return {"codes": all_error_codes, "errors": errors_out}


class MailSender:
    SITE_URL_BACKEND = "http://localhost:3000/api/v1/"
    SITE_URL_FRONTEND = "http://localhost:4200/"

    def __init__(self):
        self._email_settings = {
            'port': settings.MAILER_PORT,
            'host': settings.MAILER_HOST,
            'user': settings.MAILER_USER,
            'email_from': settings.MAILER_EMAIL_FROM,
            'password': settings.MAILER_PASSWORD,
        }
        print("\nMAILER SETTINGS ", self._email_settings)

    def _send_mail(self, email_to: str, title: str, msg: str, msg_html: str = "",  attachments: list = []):
        email_to_out = 'tester@example.com'   # TODO - just a safety measure during testing

        print(f"\nTO: {email_to_out} \nTITLE: {title}\nMSG: {msg}\n\n")  # TODO TODO TODO 
        context = ssl.create_default_context()

        try:
            with smtplib.SMTP_SSL(self._email_settings['host'], self._email_settings['port'], context=context) as smtp_srv:
                smtp_srv.login(self._email_settings['user'], self._email_settings['password'])

                msg_out = MIMEMultipart("alternative")
                part_plain = MIMEText(msg, "plain")
                part_html = MIMEText(msg_html if (msg_html is not None and msg_html != '') else msg, "html")
                msg_out.attach(part_plain)
                msg_out.attach(part_html)
                msg_out['Subject'] = title
                msg_out['From'] = self._email_settings['email_from']
                msg_out['To'] = email_to_out

                if attachments:
                    for att in attachments:
                        # eg. file_name="hello_world.txt" 
                        #     file_contents = b"Hello world", 
                        #     file_type_main = "text", 
                        #     file_type_sub = "plain"
                        msg_out.add_attachment(att['file_contents'], maintype=att['file_type_main'], subtype=att['file_type_sub'])
                smtp_srv.send_message(msg_out, self._email_settings['email_from'], email_to_out)
                smtp_srv.quit()                
        except Exception as e:
            print("\nmail sending error", e, "\n\n")
        

    def send_registration_mail(self, email: str, user: models.User):
        url: str = f"{self.SITE_URL_FRONTEND}register/confirm/{user.email}/{user.register_activation_token}/"
        you = user.full_name_with_email
        body = f"""
        Hello {you}.\n
        Thank you for the registration! \n
        To activate your account, please open this link in your browser:\n\t{url}\n\n
        and follow the instructions.\n\n
        """

        body_html = f"""
        <p>Hello {you}.</p>
        <p>Thank you for the registration!</p><br />
        <p>To activate your account, please click <b><u><a href="{url}">here</a></u></b> and follow the instructions.</p> <br />
        """
        self._send_mail(email, "Sobosite - Registration", body, body_html)

    def send_password_reset_mail(self, email, user):
        url: str = f"{self.SITE_URL_FRONTEND}reset-password/confirm/{user.email}/{user.password_reset_token}/"
        you = user.full_name_with_email
        body = f"""
        Hello {you}.\n
        You requested to reset your password for the account {email}.\n
        To do this, please open this link in your browser:\n\t{url}\n\n
        and follow the instructions.\n\n
        """

        body_html = f"""
        <p>Hello {you}.</p>
        <p>You requested to reset your password for the account <b>{email}</b></p><br />
        <p>To do this, please click <b><u><a href="{url}">here</a></u></b> and follow the instructions.</p>
        """
        self._send_mail(email, "Sobosite - Password Reset", body, body_html)


class Security:
    @staticmethod
    def generate_password_reset_token(token_len=128):
        return secrets.token_hex(token_len)    
    
    @staticmethod
    def generate_register_activation_token(token_len=130):
        return secrets.token_hex(token_len)


class UserFormsAuth:
    @staticmethod
    def authenticate_username_password(username: str, password: str):
        try:
            user = models.User.objects.get(**{models.User.USERNAME_FIELD: username})
            assert user.is_active
            assert user.check_password(password)
            user.last_login = dt.datetime.now(dt.UTC)
            user.save()
        except(models.User.DoesNotExist):
            raise PermissionDenied()
        except(AssertionError):
            raise PermissionDenied()
        
        return user
        
    @classmethod
    def generate_token_for_login_data(cls, username: str, password: str):
        try: 
            user = cls.authenticate_username_password(username, password)
        except(PermissionDenied):
            return None, None

        token, is_created = Token.objects.get_or_create(user=user)
        return token, user
    
    @staticmethod
    def log_out(request):
        if request.auth and request.user:
            request.user.auth_token.delete()
            request.auth = None 
            request.user = None 
        return utils.uni_response()


class UserFormsRegister:
    @staticmethod
    def register(data):
        ser = sers.UserRegisterSerializer(data=data)

        res = ser.is_valid(raise_exception=False)
        if not res:
            errors_out = serialize_error_data(ser.errors)
            print("errors out ", errors_out)
            status = 403 if "unique" in errors_out["codes"] else 400
            return utils.uni_response({"errors": errors_out}, status=status)

        token = utils.Security.generate_register_activation_token()

        user = ser.save()
        user.is_staff = False
        user.is_active = False        
        user.set_password(ser.validated_data['password'])
        user.register_activation_token = token
        user.save()
        utils.MailSender().send_registration_mail(ser.validated_data['email'], user)
        
        return utils.uni_response(data={
                ser.validated_data['email'],
                ser.validated_data['first_name'],
                ser.validated_data['last_name']})
    
    @staticmethod
    def register_confirm(email: str, register_activation_token: str):
        try: 
            user = models.User.objects.get(register_activation_token=register_activation_token, email=email)
            user.register_activation_token = None
            user.is_active=True
            user.save()
            return utils.uni_response()
        except(models.User.DoesNotExist):
            return utils.uni_response(errors={"_": [('user_does_not_exist',"User does not exist")]}, status=403)
        except(Exception):
            return utils.uni_response(errors={"_": [('user_does_not_exist',"User does not exist")]}, status=403)


class ProfileUtils:
    @staticmethod
    def update_profile(user, data) -> sers.UserSerializerForUserPanelsReadOnly:
        ser = sers.UserSerializerForUserPanels(user, 
            data=data, partial=False, context={'user': user})
        res = ser.is_valid(raise_exception=False)
        if not res:
            return uni_response(errors=serialize_error_data(ser.errors), status=400)

        instance = ser.save()
        return uni_response(data=sers.UserSerializerForUserPanelsReadOnly(instance))

    def change_password(user, data):
        ser = sers.ChangePasswordSerializer(data=data, context={'user': user})
        res = ser.is_valid(raise_exception=False) 
        if not res:
            return uni_response(errors=serialize_error_data(ser.errors), status=400)

        user.set_password(ser.validated_data['new_password'])
        user.save()

        return utils.uni_response()


class ResetPasswordUtils:
    @staticmethod
    def reset_password(user, data):
        ser = sers.ResetPasswordSerializer(data=data)
        ser.is_valid(raise_exception=True)

        try:
            print("\n val data ", ser.validated_data, "\n\n")
            user = models.User.objects.get(email=ser.validated_data['email'])
            print("USER ", user)

            assert user.is_active

            user.password_reset_token = utils.Security.generate_password_reset_token()
            user.password_reset_token_valid_thru = dt.datetime.now(dt.UTC) + dt.timedelta(minutes=30)
            user.save()
            utils.MailSender().send_password_reset_mail(ser.validated_data['email'], user)
            
            return utils.uni_response()
        except(models.User.DoesNotExist):
            return utils.uni_response(errors={"_": [('password_reset_error', 'password_reset_error')]}, status=403)
        except(AssertionError):
            return utils.uni_response(errors={"_": [('password_reset_error', 'password_reset_error')]}, status=403)
        except(Exception):
            return utils.uni_response(errors={"_": [('password_reset_error', 'password_reset_error')]}, status=403)

    def reset_password_confirm(user, data, email, token):
        ser = sers.ResetPasswordConfirmSerializer(data=data)
        ser.is_valid(raise_exception=True)

        try: 
            user = models.User.objects.get(password_reset_token=token, email=email)
            assert user.is_active
            user.set_password(ser.validated_data['new_password'])
            user.password_reset_token = None
            user.password_reset_token_valid_thru = None
            user.save()

            return utils.uni_response()
        except(models.User.DoesNotExist):
            return utils.uni_response(errors={"_": [
                ('password_reset_confirm_error', 'password_reset_confirm_error')]}, status=403)
        except(AssertionError):
            return utils.uni_response(errors={"_": [
                ('password_reset_confirm_error', 'password_reset_confirm_error')]}, status=403)
        except(Exception):
            return utils.uni_response(errors={"_": [
                ('password_reset_confirm_error', 'password_reset_confirm_error')]}, status=403)

