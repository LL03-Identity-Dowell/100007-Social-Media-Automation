# 100007-Social-Media-Automation

> **Notebook Icon:**
> 
> ![Notebook Icon](notebook-icon.png)
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

> **Notebook Icon:**
> 
> ![Notebook Icon](notebook-icon.png)
>
> For this crucial step to work you have to be in the directory where the file `requirements.txt` resides. 

## Create and Switch to a Branch
> **Notebook Icon:**
> 
> ![Notebook Icon](notebook-icon.png)
>
> In our case the `branchnames` will be your name, check the repo for the way your names have been added to avoid confusion. 


1. In the terminal or command prompt, use the following command to create a branch
> **Notebook Icon:**
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
> **Notebook Icon:**
> 
> ![Notebook Icon](notebook-icon.png)
>
> This steps are important. Make sure to follow it carefully.


Now you have cloned the code repository, set up a virtual environment, and created a new branch for your development work. You are ready to start working on the code in an isolated environment.

## Running the application

1. In the terminal or command prompt, use the following command to run the application:

```
python3 manage.py runserver

```

## errors

In case you run into any errors at this point check back with your team lead for further assistance. 

### Happy Coding 😊

## Folder structure
Folder Structure 
============================

> Social-media-automation folder structure

## License
<http://www.apache.org/licenses/>
(https://choosealicense.com/licenses/apche/)