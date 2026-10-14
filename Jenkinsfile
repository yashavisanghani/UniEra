// UniEra – Jenkins Pipeline (SLA Task 2) – same style as Expt 6 "Jenkins Pipeline Demo App"
// Before building:
//   1. Plugins -> Available plugins -> "NodeJS" -> Install, restart Jenkins
//   2. Tools -> Add NodeJS -> Name: NodeJS 24 -> version 24.x -> Save
//   3. Manage Jenkins -> System -> Environment variables -> PATH+PYTHON = your Python folder;Python\Scripts
//   4. XAMPP -> start MySQL
// Then: New Item -> Pipeline -> "Pipeline script from SCM" -> Git -> your repo URL -> Branch */main -> Script Path: Jenkinsfile

pipeline {
    agent any

    tools {
        nodejs 'NodeJS 24'          // the NodeJS installation you created under Manage Jenkins -> Tools
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                // change this URL to YOUR GitHub repo
                git branch: 'main', url: 'https://github.com/YOUR-USERNAME/UniEra.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('uniera-backend') {
                    bat 'python --version'
                    bat 'python -m pip install -r requirements.txt'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('uniera-frontend') {
                    bat 'node --version'
                    bat 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('uniera-frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying UniEra...'
                dir('uniera-backend') {
                    bat 'start /B python app.py'
                }
                dir('uniera-frontend') {
                    bat 'start /B npm run preview -- --port 4173'
                }
                echo 'Open http://localhost:4173 in your browser NOW (site stays up for 2 minutes)'
                sleep 120
                // stop the servers again (same idea as taskkill in Expt 6)
                bat '''
                    taskkill /F /IM node.exe
                    for /f "tokens=5" %%p in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%p
                    exit /b 0
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
