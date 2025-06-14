# Generated by Django 5.0.6 on 2024-08-05 23:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revolap', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dimentity',
            name='addr_country',
        ),
        migrations.AddField(
            model_name='dimentity',
            name='addr_country_code',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='dimentity',
            name='addr_country_name',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='dimentity',
            name='addr_city',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='dimentity',
            name='addr_details',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='dimentity',
            name='region',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
