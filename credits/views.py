# Create your views here.
from django.shortcuts import render
from django.views import View


class CreditBaseView(View):
    """
    :Brief: Custom base class for django's class-based views
    """

    def __init__(self, **kwargs):
        """ Initializes the base view object
        """
        self.context_dict = {}
        super(CreditBaseView, self).__init__(**kwargs)

    def dispatch(self, request, *args, **kwargs):
        """ Customized dispatch method
        """
        response = super(CreditBaseView, self).dispatch(request, *args, **kwargs)
        return response


class CreditErrorView(CreditBaseView):

    def get(self, request, *args, **kwargs):
        """
        This view handles all the errors that relate to the credit system
        """
        credit_response = request.session.get('credit_response')
        self.context_dict.update(credit_response)
        return render(request, 'credits-error.html', self.context_dict)
