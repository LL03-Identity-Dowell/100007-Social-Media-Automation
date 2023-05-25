from django.contrib.sessions.backends.db import SessionStore as DbSessionStore
from django.utils import timezone

class CustomSessionStore(DbSessionStore):
    def create(self):
        self.expire_date = timezone.now() + timezone.timedelta(days=7)  # Set a default expiration of 7 days
        return super().create()
