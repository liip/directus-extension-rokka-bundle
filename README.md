# directus-extension-rokka-bundle

A [Rokka](https://rokka.io) integration for [Directus](https://directus.io).

## Installation

Copy the migrations located in `migrations/` to the `extensions/migrations/` folder of your Project. You might need to create the latter, because Directus doesnt generate it automatically anymore. Apply the migrations by executing `npx directus database migrate:latest`.

Place the bundle into the `extensions/` folder of your Project. Restart Directus, and the Rokka Bundle should be installed.

## Usage

Go to the Project Settings and scroll to the Rokka section. Enter your Organization and API Key into the Fields.
You can check the entered credentials by using the "Check credentials" button.
You may want to adjust the Stack Prefix aswell: Its prepended to the name of the transformation presets when synchronizing them to Rokka Stacks.
You can synchronize the transformation presets by pressing the "Synchronize transformation presets" button, and then clicking the button in the top right corner of the newly opened drawer.

To upload an image to Rokka manually, you must navigate to the detail page of the file, and scrolling down to the Rokka File Details. The synchronization status will be shown, and you can Upload or Remove the image, depending on its current status. If the image is uploaded to rokka, you will have the ability to set or remove a focus point on the image, which will be taken into account when using, for example, crop operations.
