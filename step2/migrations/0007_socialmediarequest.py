# Generated by Django 3.2.7 on 2023-10-11 12:31

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('step2', '0006_auto_20221209_0724'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialMediaRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_datetime', models.DateTimeField(auto_now_add=True, null=True)),
                ('created_by', models.CharField(default='', max_length=500, null=True)),
                ('modified_datetime', models.DateTimeField(auto_now=True, null=True)),
                ('modified_by', models.CharField(default='', max_length=500, null=True)),
                ('username', models.CharField(max_length=500)),
                ('email', models.CharField(max_length=500)),
                ('name', models.CharField(max_length=500)),
                ('is_approved', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
