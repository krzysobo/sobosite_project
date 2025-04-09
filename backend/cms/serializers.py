# class UserSerializerForUserPanelsReadOnly(serializers.ModelSerializer):
#     """ used by users (common and admins) in their "my own" panels """
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name', 'status', 'role', 'is_staff']
#         read_only_fields = fields


# TODO FIXME!!! DEVELOP!!!
# from django.contrib.auth.hashers import make_password
# from django.utils.translation import gettext_lazy as _
# from rest_framework import serializers, exceptions, status
# from user_forms.models import User
#
#
# class UserSerializerForAdminPanels(serializers.ModelSerializer):
#     """ used by administrators in admin panels etc. """
#     password = serializers.CharField(required=False, trim_whitespace=True, write_only=True, allow_blank=True)
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'status', 'role',
#                   'no_failed_logins', 'failed_is_blocked', 'failed_is_blocked_thru', 'password']
#         read_only_fields = ['id', 'status']
#         write_only_fields= ['password']
#
#         #   'created_at', 'updated_at',
#         #   'password_reset_token','password_reset_valid_thru', 'register_activation_code'
#     # def validate_email(self, value):
#     #     # if not self.context['user'].
#     #     # don't allow changing email to another user's email
#     #     if User.objects.filter(email=value).exclude(id=self.context['user'].id).count() > 0:
#     #         raise serializers.ValidationError("User Already Exists")
#     #     return value
#
#     def validate_password(self, value):
#         if value and value != "":
#             return make_password(value)
#
#         return self.context['user'].password
#
#
# class CreateUserSerializerForAdminPanels(serializers.ModelSerializer):
#     """ used by administrators - "create" action, in admin panels etc. """
#     password = serializers.CharField(required=True, trim_whitespace=False, write_only=True)
#
#     class Meta:
#         model = User
#         fields = ['email', 'first_name', 'last_name', 'is_staff',
#                   'is_active', 'role', 'password']
#
#     # def validate_email(self, value):
#     #     if User.objects.filter(email=value).count() > 0:
#     #         raise serializers.ValidationError("User Already Exists")
#     #     return value
#
#
# class UserSerializerForUserPanels(serializers.ModelSerializer):
#     """ used by users (common and admins) in their "my own" panels """
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name']
#         read_only_fields = ['id']
#         optional_fields = ['first_name', 'last_name']
#
#     # def validate_email(self, value):
#     #     print("AAAAA", self.context)
#     #     # if User.objects.filter(email=value).exclude(id=self.context['user'].id).count() > 0:
#     #     #     raise serializers.ValidationError("User Already Exists")
#     #     return value
#
#
# class UserSerializerForUserPanelsReadOnly(serializers.ModelSerializer):
#     """ used by users (common and admins) in their "my own" panels """
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name', 'status', 'role', 'is_staff']
#         read_only_fields = fields
#
#
# class UserRegisterSerializer(serializers.ModelSerializer):
#     """ used by users (common and admins) in their "my own" panels.
#         "create" action (registration). """
#     class Meta:
#         model = User
#         fields = ['email', 'first_name', 'last_name', 'password']
#         optional_fields=['first_name', 'last_name']
#
#     # def validate_email(self, value):
#     #     if User.objects.filter(email=value).count() > 0:
#     #         raise serializers.ValidationError("User Already Exists")
#     #     return value
#
#
# class LoginSerializer(serializers.Serializer):
#     """ used for the log-in action"""
#     email = serializers.CharField(required=True, write_only=True)
#     password = serializers.CharField(required=True, trim_whitespace=False, write_only=True)
#
#
# class ResetPasswordSerializer(serializers.Serializer):
#     """ used for the password reset (sending a request to reset password) action """
#     email = serializers.CharField(required=True, write_only=True)
#
#
# class ResetPasswordConfirmSerializer(serializers.Serializer):
#     """ used for the password reset confirmation (setting up the new password) action """
#     new_password = serializers.CharField(required=True, write_only=True)
#
#
# class ChangePasswordSerializer(serializers.Serializer):
#     """ used for changing password in the user panel; requires providing of the correct current password """
#     old_password = serializers.CharField(required=True, write_only=True)
#     new_password = serializers.CharField(required=True, trim_whitespace=False, write_only=True)
#
#     def validate_old_password(self, value):
#         if not self.context['user'].check_password(value):
#             raise serializers.ValidationError("INCORRECT_CUR_PWD")
#         return value
#
#     def validate_new_password(self, value):
#         if not value or not isinstance(value, str) or value.strip() == "":
#             raise serializers.ValidationError("INCORRECT_NEW_PWD")
#         return value
#
