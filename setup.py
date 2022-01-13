from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in scholarships_management/__init__.py
from scholarships_management import __version__ as version

setup(
	name="scholarships_management",
	version=version,
	description="Scholarships Management App",
	author="repoteq",
	author_email="muhammadnassef34@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
