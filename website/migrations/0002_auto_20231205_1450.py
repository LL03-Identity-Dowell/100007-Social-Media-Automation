# Generated by Django 3.2.7 on 2023-12-05 11:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('website', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sentences',
            name='adjective',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='sentences',
            name='object_determinant',
            field=models.CharField(blank=True, choices=[('-', ''), ('the', 'the'), ('a', 'a'), ('an', 'an')],
                                   default='-', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='sentences',
            name='subject_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='sentences',
            name='verb',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
