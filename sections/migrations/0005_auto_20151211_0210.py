# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-11 02:10
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sections', '0004_auto_20151210_0353'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='reinforcement',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=[0, 0, 0]),
        ),
    ]
