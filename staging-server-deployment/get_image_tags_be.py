"""
This script is used to fetch the list of tags for all the artifacts in the given project and repository in Harbor Registry.

The script takes the following arguments:
1. Harbor Registry Server URL
2. Username
3. Password
4. Project Name
5. Repository Name

The script then uses the Harbor API to fetch the list of tags for all the artifacts in the given project and repository, and saves it to a file named "images_BE_tags.txt" in the current directory.

Note: Make sure to replace the placeholders with the actual values before running the script.
"""

import requests
import json
import os
import base64

def get_tags_from_harbor(harbor_server, username, password, project_name, repository_name):
    """
    This function uses the Harbor API to fetch the list of tags for all the artifacts in the given project and repository.

    Args:
        harbor_server (str): Harbor Registry Server URL
        username (str): Username
        password (str): Password
        project_name (str): Project Name
        repository_name (str): Repository Name

    Returns:
        list: List of tags for all the artifacts in the given project and repository
    """
    # Create the authentication token
    auth_token = base64.b64encode(f"{username}:{password}".encode()).decode()

    # Make the API request to fetch the list of tags
    response = requests.get(
        f"{harbor_server}/api/v2.0/projects/{project_name}/repositories/{repository_name}/artifacts?with_tag=true",
        headers={"Authorization": f"Basic {auth_token}"}
    )

    # Parse the response JSON and extract the tags
    tags = [tag["name"] for artifact in response.json()["artifacts"] for tag in artifact["tags"]]

    return tags

if __name__ == "__main__":
    # Read the arguments from the command line
    harbor_server = os.environ.get("HARBOR_SERVER")
    username = os.environ.get("USERNAME")
    password = os.environ.get("PASSWORD")
    project_name = os.environ.get("PROJECT_NAME")
    repository_name = os.environ.get("REPOSITORY_NAME")

    # Check if the "images_BE_tags.txt" file exists. If not, create it.
    if not os.path.exists("images_BE_tags.txt"):
        with open("images_BE_tags.txt", "w") as f:
            f.write("")

    # Get the list of tags from Harbor
    tags = get_tags_from_harbor(harbor_server, username, password, project_name, repository_name)

    # Save the list of tags to a file
    with open("images_BE_tags.txt", "w") as f:
        f.write("\n".join(tags))