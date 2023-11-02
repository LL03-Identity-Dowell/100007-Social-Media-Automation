from django.shortcuts import render, redirect
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
        if request.GET.get('reload') == '1':
            return redirect('generate_article:dowelllogin')
        credit_response = request.session.get('credit_response')
        try:
            self.context_dict.update(credit_response)
        except TypeError:
            return redirect('generate_article:dowelllogin')
        return redirect('generate_article:dowelllogin')