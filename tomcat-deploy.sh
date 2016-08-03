#!/usr/bin/env bash
#/bin/bash
TOMCAT_HOME="/usr/local/apache-tomcat-8.0.30"
APP="gs-actuator-service-0.1.0"
name="actu"
dir=`pwd`

# =========================
# Change Context Path
# =========================
changeContextPath() {
    tmpPage="/tmp/tmp.jsp"
    cp $1 ${tmpPage}
    cat ${tmpPage} | sed 's/"\/css/"\/actu\/css/' \
                   | sed 's/"\/js/"\/actu\/js/' \
                   | sed 's/"\/home/"\/actu\/home/' \
                   | sed 's/"\/images/"\/actu\/images/' \
                   | sed 's/"\/app/"\/actu\/app/' > $1
    echo "-> $1"
}

# =========================
# Start
# =========================
echo "Deploy ${APP} to ${TOMCAT_HOME}/webapps/${name}"

rm -fR ${TOMCAT_HOME}/webapps/${name}
echo "Deleted ${TOMCAT_HOME}/webapps/${name}"

cp -R target/${APP} ${TOMCAT_HOME}/webapps
cd ${TOMCAT_HOME}/webapps
mv ${APP} ${name}
echo "Created ${TOMCAT_HOME}/webapps/${name}"

echo "Change Context Path for the following files:"
for h in `ls ${name}/WEB-INF/pages/actuate/*.html` ; do
   changeContextPath ${h}
done

cd ${dir}
