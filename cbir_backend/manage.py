#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cbir_backend.settings")

    try:
        from django.core.management import execute_from_command_line
        from django.contrib.auth import get_user_model
        import django

        django.setup()

        # 🔐 AUTO CREATE SUPERUSER (RENDER SAFE)
        User = get_user_model()

        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if username and password:
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(
                    username=username,
                    email=email or "",
                    password=password,
                )
                print("✅ Superuser created successfully")
            else:
                print("ℹ️ Superuser already exists")

    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and available?"
        ) from exc

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
