npm install -g eas-cli

eas login

eas build:configure

eas build -p android --profile production




project.ext.envConfigFiles = [
    release: ".env",
    debug: ".env",
    devDebug: ".env.develop",
    devRelease: ".env.develop",
    stagingDebug: ".env.staging",
    stagingRelease: ".env.staging",
    betaDebug: ".env.beta",
    betaRelease: ".env.beta",
    prodDebug: ".env",
    prodRelease: ".env",
]



    namespace "com.reactnativelearning"
    flavorDimensions "appType"
    productFlavors {
         production {
            applicationId 'com.reactnativelearning'
            resValue "string", "build_config_package", "com.reactnativelearning"
        }
        beta{
            applicationId 'com.reactnativelearning.beta'
            resValue "string", "build_config_package", "com.reactnativelearning"
        }
        dev {
            applicationId 'com.reactnativelearning.develop'
            resValue "string", "build_config_package", "com.reactnativelearning"
        }
        staging{
            applicationId 'com.reactnativelearning.staging'
            resValue "string", "build_config_package", "com.reactnativelearning"
        }
    }

    defaultConfig {
