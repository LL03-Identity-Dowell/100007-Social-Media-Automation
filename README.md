# 100007-Social-Media-Automation


>
> All this steps assumes that you have python installed in your pc/macOS
> Also you should have your favorite IDE installed. 


## Clone the Code

Follow the instructions below to clone the code repository to your local machine and set up the development environment.

1. Make sure you have Git installed on your system. You can download it from the official website: [https://git-scm.com/downloads](https://git-scm.com/downloads).

2. Open your preferred terminal or command prompt.

3. Navigate to the directory where you want to clone the code.

4. Copy the repository URL. You can find this on the repository's homepage or by clicking the "Clone" button on GitHub.

5. In the terminal or command prompt, type the following command:

```
git clone <repository_url>

```


Replace `<repository_url>` with the actual URL you copied in the previous step.

6. Press Enter to execute the command.

7. Git will start cloning the code repository to your local machine. The progress will be displayed in the terminal.

8. Once the cloning process is complete, you will have a local copy of the code on your machine.

## Set Up the Development Environment

1. Create a virtual environment named 'venv' using the following command:

```

python3 -m venv venv

```

This command creates a virtual environment named 'venv' in the current directory.

2. Activate the virtual environment depending on the terminal and operating system you are using:

- For macOS and Linux:
  ```
  source venv/bin/activate
  ```

- For Windows:
  ```
  venv\Scripts\activate
  ```

Activating the virtual environment isolates the Python environment for your project.

## Installations


install the required packages using the following command:

```

pip install -r requirements.txt

```
> 
>
> For this crucial step to work you have to be in the directory where the file `requirements.txt` resides. 

## Create and Switch to a Branch

> 
> In our case the `branchnames` will be your name, check the repo for the way your names have been added to avoid confusion. 


1. In the terminal or command prompt, use the following command to create a branch

> (your name, according to the branches created from the main branch):

```
git branch <branchname>

```

Replace `<branchname>` with a descriptive name for your branch, such as your name or a brief description of the feature you're working on.

Example: `git branch feature-xyz`

2. Switch to the newly created branch using the following command:

`git checkout <branchname>`

Replace `<branchname>` with the name of the branch you created in the previous step.

Example: `git checkout feature-xyz`

You are now on the new branch and can start making changes to the code.

>
> This steps are important. Make sure to follow it carefully.


Now you have cloned the code repository, set up a virtual environment, and created a new branch for your development work. You are ready to start working on the code in an isolated environment.

## Running the application

1. In the terminal or command prompt, use the following command to run the application:

```
python3 manage.py makemigrations

```

2. In the terminal or command prompt, use the following command to run the application:

```
python3 manage.py migrate

```

3. In the terminal or command prompt, use the following command to run the application:

```
python3 manage.py runserver

```

## errors
you are bound to run into one error with this file depending on your OS ```..\100007-Social-Media-Automation\venv\Lib\site-packages\tenacity\_asyncio.py```

if you do, replace the contents of the file with:
```
# -*- coding: utf-8 -*-
# Copyright 2016 Étienne Bersac
# Copyright 2016 Julien Danjou
# Copyright 2016 Joshua Harlow
# Copyright 2013-2014 Ray Holder
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

try:
    import asyncio
except ImportError:
    asyncio = None

import sys

from tenacity import BaseRetrying
from tenacity import DoAttempt
from tenacity import DoSleep
from tenacity import RetryCallState


if asyncio:
    class AsyncRetrying(BaseRetrying):

        def __init__(self,
                     sleep=asyncio.sleep,
                     **kwargs):
            super(AsyncRetrying, self).__init__(**kwargs)
            self.sleep = sleep

    
        async def call(self, fn, *args, **kwargs):
            self.begin(fn)

            retry_state = RetryCallState(
                retry_object=self, fn=fn, args=args, kwargs=kwargs)
            while True:
                do = self.iter(retry_state=retry_state)
                if isinstance(do, DoAttempt):
                    try:
                        result = await fn(*args, **kwargs)
                    except BaseException:
                        retry_state.set_exception(sys.exc_info())
                    else:
                        retry_state.set_result(result)
                elif isinstance(do, DoSleep):
                    retry_state.prepare_for_next_attempt()
                    await self.sleep(do)
                else:
                    return do
```

In case you run into any other errors at this point check back with your team lead for further assistance. 

### Happy Coding 😊

## Folder structure
Folder Structure 
============================

> Social-media-automation folder structure

## License
<http://www.apache.org/licenses/>
(https://choosealicense.com/licenses/apche/)