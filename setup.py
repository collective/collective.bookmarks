# -*- coding: utf-8 -*-
"""Installer for the collective.bookmarks package."""

from setuptools import find_packages
from setuptools import setup


long_description = "\n\n".join(
    [
        open("README.rst").read(),
        open("CONTRIBUTORS.rst").read(),
        open("CHANGES.rst").read(),
    ]
)


setup(
    name="collective.bookmarks",
    version="1.1.a1",
    description="Bookmarks/ favorites (internal) for Plone",
    long_description=long_description,
    # Get more from https://pypi.org/classifiers/
    classifiers=[
        "Environment :: Web Environment",
        "Framework :: Plone",
        "Framework :: Plone :: Addon",
        "Framework :: Plone :: 5.2",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Operating System :: OS Independent",
        "License :: OSI Approved :: GNU General Public License v2 (GPLv2)",
    ],
    keywords="Python Plone",
    author="Jens W. Klein",
    author_email="jk@kleinundpartner.at",
    url="https://github.com/collective/collective.bookmarks",
    project_urls={
        "PyPI": "https://pypi.python.org/pypi/collective.bookmarks",
        "Source": "https://github.com/collective/collective.bookmarks",
        "Tracker": "https://github.com/collective/collective.bookmarks/issues",
        # 'Documentation': 'https://collective.bookmarks.readthedocs.io/en/latest/',
    },
    license="GPL version 2",
    packages=find_packages("src", exclude=["ez_setup"]),
    namespace_packages=["collective"],
    package_dir={"": "src"},
    include_package_data=True,
    zip_safe=False,
    python_requires=">=3.7",
    install_requires=[
        "plone.restapi",
        "setuptools",
        "souper.plone",
    ],
    extras_require={
        "test": [
            "plone.app.contenttypes[test]",
            "Products.CMFPlone[test]",
        ],
    },
    entry_points="""
    [z3c.autoinclude.plugin]
    target = plone
    [console_scripts]
    update_locale = collective.bookmarks.locales.update:update_locale
    """,
)
