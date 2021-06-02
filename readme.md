## Vaccine Slot Notifier

A Node CLI application to provide push notifications on desktop and sms notification on your mobile for availability of vaccine slots.

Inputs include:

- Pincode
- Date (mm-dd-yyyy) or default-blank string('')

API Used: [CoWin Public API](https://apisetu.gov.in/public/marketplace/api/cowin#/Appointment%20Availability%20APIs/findByPin)

### The CLI will perform the follow functions

- Ability to get slots by pincode.
- Ability to filter slots by ages as we have slots by 18-45 and 45 and above.
- Ability to send desktop notification.
- Date for search criteria is defaulted to present day.
- Ability to send SMS notification (if you enable API_KEY).

### Requirements to run (or) develop on system

- [Visual studio code](https://code.visualstudio.com/download)

- Install Node js on your system.
  - [Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  - [Video](https://www.youtube.com/watch?v=JINE4D0Syqw)

### How to Use

- Clone repository and run command: `npm install`
- CLI Commands

  `cowin` : shows all available options
  (currently only supports search by pincode)

  `cowin <pincode> <date>`

  - replace `<pincode>` by some valid value like 110042
  - replace `<date>` either by `''` (blank string) or desired date

  - select age group from drop down presented on CLI

### Screenshots of notifications
- Push notification on system 

![ADC65EF1-9A6C-40F5-89A9-B523C455A2CA](<img src="https://user-images.githubusercontent.com/17775859/120505870-04c5da80-c3e3-11eb-82e0-32a4e686ca54.jpeg" width="200" height="200">)
- Text Notification 

![text-notif](<img src="https://user-images.githubusercontent.com/17775859/120506591-b107c100-c3e3-11eb-8c39-2297b0df4c06.jpeg" width="200" height="200">)


### Result

- Push notification on desktop for available slots with details like

  - address of center
  - available number of doses
  - available time slots

- There is a provision to setup SMS service also (currently disabled as service is not free)
  - API-KEY can be obtained [fast2sms](https://www.fast2sms.com/dashboard/dev-api) and place API_KEY = _value from fast2sms_
    - (uncomment corresponding method for SMS notification `notifyOnSMS(message)`)

### Node Package used

- Axios –for calling the different api’s
- Chalk – for beautifying the console output
- Commander – giving the different options and command in CLI
- Inquirer – for getting user input for entering the age filter
- Node-notifier – send desktop notification
- Tty-table – format our table output
- fast-two-sms - as a messaging service
