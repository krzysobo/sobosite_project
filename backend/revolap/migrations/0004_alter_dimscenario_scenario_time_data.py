# Generated by Django 5.0.6 on 2024-08-05 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revolap', '0003_alter_dimentity_addr_country_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dimscenario',
            name='scenario_time_data',
            field=models.JSONField(null=True),
        ),
    ]
