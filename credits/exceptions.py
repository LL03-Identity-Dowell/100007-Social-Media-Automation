class CustomError(Exception):
    """Base class for custom exceptions."""
    pass


class CreditError(Exception):
    """Base class for custom exceptions."""
    pass


class CouldNotGetUserAPIKeyError(CreditError):
    """Exception raised for when an error occurs when getting user Credit system api key"""

    def __init__(self, message):
        self.message = message


class CouldNotConsumeCreditError(CreditError):
    """Exception raised for when an error occurs when getting user Credit system api key"""

    def __init__(self, message):
        self.message = message
