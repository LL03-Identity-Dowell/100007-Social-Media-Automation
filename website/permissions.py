import requests
from rest_framework import permissions


class HasBeenAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):

        if 'session_id' in request.session and 'username' in request.session:
            return True
        session_id = request.GET.get("session_id", None)
        if not session_id:
            return False

        url_1 = "https://100093.pythonanywhere.com/api/userinfo/"
        # headers = {"Authorization": f"Bearer {session_id}"}
        response_1 = requests.post(url_1, data={"session_id": session_id})
        if response_1.status_code == 200 and "portfolio_info" in response_1.json():

            profile_details = response_1.json()
            request.session['portfolio_info'] = profile_details['portfolio_info']

        else:
            # Second API
            url_2 = "https://100014.pythonanywhere.com/api/userinfo/"
            response_2 = requests.post(
                url_2, data={"session_id": session_id})
            if response_2.status_code == 200 and "portfolio_info" in response_2.json():

                profile_details = response_2.json()
                request.session['portfolio_info'] = profile_details['portfolio_info']

            else:
                # Neither API returned portfolio_info data
                profile_details = {}
                request.session['portfolio_info'] = []
                return False

        if "userinfo" in profile_details:
            request.session['userinfo'] = profile_details['userinfo']
            request.session['username'] = profile_details['userinfo']['username']
            request.session['user_id'] = profile_details['userinfo']['userID']
            request.session['timezone'] = profile_details['userinfo']['timezone']

        if request.session['portfolio_info'] == []:
            request.session['operations_right'] = 'member'
            request.session['org_id'] = '0001'
        else:
            for info in request.session['portfolio_info']:
                if info['product'] == 'Social Media Automation':
                    request.session['operations_right'] = info['operations_right']
                    request.session['org_id'] = info['org_id']
                    break
            else:
                request.session['operations_right'] = 'member'
                request.session['org_id'] = info['org_id'] if info else ''

        # Adding session id to the session
        request.session['session_id'] = session_id
        return True


def can_view_page(request, ):
    session_id = request.GET.get("session_id", None)
    if not session_id:
        return False

    url_1 = "https://100093.pythonanywhere.com/api/userinfo/"
    # headers = {"Authorization": f"Bearer {session_id}"}
    response_1 = requests.post(url_1, data={"session_id": session_id})
    if response_1.status_code == 200 and "portfolio_info" in response_1.json():

        profile_details = response_1.json()
        request.session['portfolio_info'] = profile_details['portfolio_info']

    else:
        # Second API
        url_2 = "https://100014.pythonanywhere.com/api/userinfo/"
        response_2 = requests.post(
            url_2, data={"session_id": session_id})
        if response_2.status_code == 200 and "portfolio_info" in response_2.json():

            profile_details = response_2.json()
            request.session['portfolio_info'] = profile_details['portfolio_info']

        else:
            # Neither API returned portfolio_info data
            profile_details = {}
            request.session['portfolio_info'] = []
            return False

    if "userinfo" in profile_details:
        request.session['userinfo'] = profile_details['userinfo']
        request.session['username'] = profile_details['userinfo']['username']
        request.session['user_id'] = profile_details['userinfo']['userID']
        request.session['timezone'] = profile_details['userinfo']['timezone']

    if request.session['portfolio_info'] == []:
        request.session['operations_right'] = 'member'
        request.session['org_id'] = '0001'
    else:
        for info in request.session['portfolio_info']:
            if info['product'] == 'Social Media Automation':
                request.session['operations_right'] = info['operations_right']
                request.session['org_id'] = info['org_id']
                break
        else:
            request.session['operations_right'] = 'member'
            request.session['org_id'] = info['org_id'] if info else ''

    # Adding session id to the session
    request.session['session_id'] = session_id
    return True


class HasLoggedIn(permissions.BasePermission):
    def has_permission(self, request, view):
        if 'session_id' in request.session and 'username' in request.session:
            return False

        return True
