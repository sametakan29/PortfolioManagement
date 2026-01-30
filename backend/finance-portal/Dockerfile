# build stage #Docker container içinde mvn build alıyoruz.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY finance-portal-api/pom.xml ./pom.xml
COPY finance-portal-api/src ./src
RUN mvn clean package -DskipTests

# runtime stage
#Java 21 çalıştırabilen boş bir sistemle başla.(JRE var, Maven yok)
FROM eclipse-temurin:21-jre 
#Container içinde çalışma klasörü /app olsun.Conter içindeki proje dizini gibi düşn
WORKDIR /app
#Build aşamasında üretilen jar’ı al, buraya kopyala.
COPY --from=build /workspace/target/finance-portal-api-0.0.1-SNAPSHOT.jar app.jar
#Bu uygulama 8081 portunu kullanacak.Dockera bu porttan serv veriyorum
EXPOSE 8081
#Container başlayınca bu komutu çalıştır.containerin start tuşu gibi
ENTRYPOINT ["java","-jar","/app/app.jar"]
#Amaç:Sadece çalışması için gereken küçük ve temiz bir imaj üretmek.
#build ediyoruz sonra ortaya çıkan jar dosyasını(paket) çalıştır
#sadece çıkan jar’ı çalıştıran küçük ve güvenli bir imaj üretmek için multi-stage build=build için ayrı çalıştırmak için ayrı imaj kullan demektir