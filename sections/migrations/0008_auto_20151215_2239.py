# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-15 22:39
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sections', '0007_auto_20151211_0215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='actions',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={'char': [], 'freq': [], 'qp': [], 'uls': []}),
        ),
    ]
