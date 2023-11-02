# Generated by Django 3.2.7 on 2023-11-02 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=130)),
                ('paragraph', models.TextField(max_length=2000)),
                ('source', models.TextField(max_length=2000)),
                ('status', models.CharField(blank=True, choices=[('Accepted', 'Accepted'), ('Rejected', 'Rejected')], max_length=12, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='paragraph',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=130)),
                ('paragraph', models.TextField(max_length=2000)),
                ('citation_and_url', models.TextField(max_length=2000)),
                ('status', models.CharField(blank=True, choices=[('Accepted', 'Accepted'), ('Rejected', 'Rejected')], max_length=12, null=True)),
            ],
        ),
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
                ('org_id', models.CharField(blank=True, max_length=500, null=True)),
                ('is_approved', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='stepFour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=130)),
                ('paragraph', models.TextField(max_length=2000)),
                ('source', models.TextField(max_length=2000, null=True)),
                ('qualitative_categorization', models.CharField(max_length=130)),
                ('targeted_for', models.CharField(max_length=130)),
                ('designed_for', models.CharField(max_length=130)),
                ('targeted_category', models.CharField(max_length=130)),
                ('image', models.ImageField(upload_to='article_images/')),
            ],
        ),
    ]
