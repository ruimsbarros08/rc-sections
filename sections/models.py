from __future__ import unicode_literals
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.contrib.auth.models import User

RECT = 'RECT'
CIRC = 'CIRC'
T = 'T'
I = 'I'
U = 'U'
SECTION_TYPE = (
	(RECT, 'Rectangular'),
	(CIRC, 'Circular'),
	(T, 'T'),
	(I, 'I'),
	(U, 'U'),
)

C12_15 = 'C12_15'
C16_20 = 'C16_20'
C20_25 = 'C20_25'
C25_30 = 'C25_30'
C30_37 = 'C30_37'
C35_45 = 'C35_45'
C40_50 = 'C40_50'
C45_55 = 'C45_55'
C50_60 = 'C50_60'
C55_67 = 'C55_67'
C60_75 = 'C60_75'
C70_85 = 'C70_85'
C80_95 = 'C80_95'
C90_105 = 'C90_105'
CONCRETE_CLASS = (
	(C12_15, 'C12/15'),
	(C16_20, 'C16/20'),
	(C20_25, 'C20/25'),
	(C25_30, 'C25/30'),
	(C30_37, 'C30/37'),
	(C35_45, 'C35/45'),
	(C40_50, 'C40/50'),
	(C45_55, 'C45/55'),
	(C50_60, 'C50/60'),
	(C55_67, 'C55/67'),
	(C60_75, 'C60/75'),
	(C70_85, 'C70/85'),
	(C80_95, 'C80/95'),
	(C90_105, 'C90/105'),
)

A400 = 'A400'
A500 = 'A500'
STEEL_CLASS = (
	(A400, 'A400'),
	(A500, 'A500'),
)

# ULTIMATE = 'ULTIMATE'
# SERVICE = 'SERVICE'
# LIMIT_STATE = (
# 	(ULTIMATE, 'Ultimate'),
# 	(SERVICE, 'Service'),
# )

class Section(models.Model):
	owner			= models.ForeignKey(User, related_name='sections')
	created 		= models.DateTimeField(auto_now_add=True)
	modified 		= models.DateTimeField(auto_now_add=True)
	title 			= models.CharField(max_length=100, default='Untitled')
	description 	= models.TextField(null=True)
	section_type	= models.CharField(max_length=20, choices=SECTION_TYPE, default=RECT)
	concrete_class	= models.CharField(max_length=20, choices=CONCRETE_CLASS, default=C20_25)
	steel_class		= models.CharField(max_length=20, choices=STEEL_CLASS, default=A500)
	geometry 		= JSONField(default = { "height": 0.4,
											"width": 0.2,
											"diam": 0.4,
											"bw": 0.1,
											"hf": 0.1,
											"hf1": 0.1,
											"hf2": 0.1,
											"w1t": 0.1,
											"w2t": 0.1,
											"w1t": 0.1,
											"wbt": 0.1 })
	reinforcement 	= JSONField(default=[])
	actions 		= JSONField(default={"uls": [], "char": [], "freq": [], "qp": [], })
	# limit_state		= models.CharField(max_length=20, choices=LIMIT_STATE, default=ULTIMATE)
	# height			= models.FloatField(null=True, default=0.400)
	# width			= models.FloatField(null=True, default=0.200)
	# diameter		= models.FloatField(null=True)
	# bw				= models.FloatField(null=True)
	# hf				= models.FloatField(null=True)
	# hf1				= models.FloatField(null=True)
	# hf2				= models.FloatField(null=True)
	# reinforcement 	= JSONField(default=[{"x": None, "y": None, "diam": None}])
	# actions 		= JSONField(default=[{"n": None, "my": None, "mz": None}])





