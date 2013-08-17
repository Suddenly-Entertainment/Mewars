Mock Equestrian Wars


Powered by Node.js http://nodejs.org/

**Useing modules** 

Express http://expressjs.com/
Passport http://passportjs.org/
socket.io http://socket.io/
sequelize http://sequelizejs.com/
async https://github.com/caolan/async
mime https://github.com/broofa/node-mime

==============================

The OpenShift `nodejs` cartridge documentation can be found at:

Running a custom/latest Node[.js] version on RedHat's OpenShift PaaS
====================================================================
This git repository is a sample Node application along with the
"orchestration" bits to help you run the latest or a custom version
of Node on RedHat's OpenShift PaaS.


Selecting a Node version to install/use
---------------------------------------

To select the version of Node.js that you want to run, just edit or add
a version to the .openshift/markers/NODEJS_VERSION file.

    Example: To install Node.js version 0.9.1, you can run:
       $ echo -e "0.9.1\n" >> .openshift/markers/NODEJS_VERSION


The action_hooks in this application will use that NODEJS_VERSION marker
file to download and extract that Node version if it is available on
nodejs.org and will automatically set the paths up to use the node/npm
binaries from that install directory.

     See: .openshift/action_hooks/ for more details.

    Note: The last non-blank line in the .openshift/markers/NODEJS_VERSION
          file.determines the version it will install.


Okay, now onto how can you get a custom Node.js version running
on OpenShift.


Feel free to change or remove this file, it is informational only.

Repo layout
===========
node_modules/                       - Any Node modules packaged with the app
deplist.txt                         - Deprecated.
package.json                        - npm package descriptor.
.openshift/                         - Location for openshift specific files
.openshift/action_hooks/pre_build   - Script that gets run every git push before
                                      the build
.openshift/action_hooks/build       - Script that gets run every git push as
                                      part of the build process (on the CI
                                      system if available)
.openshift/action_hooks/deploy      - Script that gets run every git push after
                                      build but before the app is restarted
.openshift/action_hooks/post_deploy - Script that gets run every git push after
                                      the app is restarted

Notes about layout
==================
Please leave the node_modules and .openshift directories but feel free to
create additional directories if needed.

Note: Every time you push, everything in your remote repo dir gets recreated
      please store long term items (like an sqlite database) in the OpenShift
      data directory, which will persist between pushes of your repo.
      The OpenShift data directory is accessible relative to the remote repo
      directory (../data) or via an environment variable OPENSHIFT_DATA_DIR.


Environment Variables
=====================
OpenShift provides several environment variables to reference for ease
of use.  The following list are some common variables but far from exhaustive:
    process.env.OPENSHIFT_GEAR_NAME  - Application name
    process.env.OPENSHIFT_GEAR_DIR   - Application dir
    process.env.OPENSHIFT_DATA_DIR  - For persistent storage (between pushes)
    process.env.OPENSHIFT_TMP_DIR   - Temp storage (unmodified files deleted after 10 days)

When embedding a database using 'rhc app cartridge add', you can reference environment
variables for username, host and password:
    process.env.OPENSHIFT_DB_HOST      - DB Host
    process.env.OPENSHIFT_DB_PORT      - DB Port
    process.env.OPENSHIFT_DB_USERNAME  - DB Username
    process.env.OPENSHIFT_DB_PASSWORD  - DB Password

When embedding a NoSQL database using 'rhc app cartridge add', you can reference environment
variables for username, host and password:
    process.env.OPENSHIFT_NOSQL_DB_HOST      - NoSQL DB Host
    process.env.OPENSHIFT_NOSQL_DB_PORT      - NoSQL DB Port
    process.env.OPENSHIFT_NOSQL_DB_USERNAME  - NoSQL DB Username
    process.env.OPENSHIFT_NOSQL_DB_PASSWORD  - NoSQL DB Password

To get a full list of environment variables, simply add a line in your
.openshift/action_hooks/build script that says "export" and push.


deplist.txt
===========
A list of node modules to install, line by line on the server. This will happen
when the user does a git push.


Additional information
======================
Link to additional information will be here, when we have it :)


