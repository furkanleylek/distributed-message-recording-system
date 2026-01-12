# Distributed Message Recording System

---
Bu proje, birden fazla sunucunun dağıtık bir küme (“family”) oluşturduğu,  **gRPC + Protobuf**  ile kendi aralarında haberleştiği ve aynı zamanda  **lider üye (cluster gateway)**  üzerinden dış dünyadan gelen  **TCP text mesajlarını**  tolerans gösterilen üye miktarı kadar diğer üyelerle paylaştığı, gerektiği zaman  **lider üyenin** mesajı diğer üyelerden aldığı, çökme durumlarının test edildiği, tolerans miktarının ve sunucu miktarının ölçeklenebilir olduğu bir dağıtık sistem proje örneğidir . 

---


# Özellikler

### ✔ Otomatik Dağıtık Üye Keşfi

### ✔ Lider Üye (Cluster Gateway)

### ✔ gRPC + Protobuf İçi Mesajlaşma

### ✔ Aile (Family) Senkronizasyonu

### ✔ Üye Düşmesi (Failover)

### ✔ Diske yazma / Diskten okuma

### ✔ tolerance.conf üzerinden dağıtım

### ✔ Round-robin ile üyelere eşit mesaj dağıtımı

### ✔ MessageIndex ile mesajların ve üyelerin kaydı


---

## 📁 Proje Yapısı

    distributed-message-recording-system/
    │
    ├── proto
    ├── src
    │   └── grpc
    |       |    ├── client.js
    │       │    ├── loader.js
    │       │    └── server.js
    │    └── handlers
    |       |    ├── createHandlers.js
    │       │    ├── handleGet.js
    │       │    └── handleSet.js
    │       │    └── periodicTasks.js
    │    └── network
    |       |    ├── clientTCPServer.js
    │       │    ├── discoverNode.js
    │    └── storage
    |       |    ├── disk.js
    │       │    ├── messageIndex.js
    │    └── utils
    |       |    ├── config.js
    │       │    ├── constants.js
    │       │    └── context.js
    │       │    └── portFinder.js
    │       │    ├── registry.js
    │	 └── index.js
    ├── package.json 
    ├── package-lock.json**


---

## 🔧 Çalıştırma

    node index.js
   
 Bu komut ile projeyi çalıştırabilirsiniz . 

---


## ▶️  Çalışma Prensibi


### 1.Dağıtık üye keşfi

> Lider üye START_PORT değerine sahip port : 5555 olarak ağa katılır . 
> Ardından başlatılan yeni terminaller ile oluşan yeni nodelar,
> discoverNode.js ile otomatik ağa katılırlar
<img width="1393" height="507" alt="Ekran Resmi 2026-01-12 23 19 53" src="https://github.com/user-attachments/assets/655145d3-1355-4960-9740-57bd5946ab81" />


### 2. Client ile bağlantı kurulması

>  Dış bağlantıdan yani Client üzerinden bir komut geldiği zaman bu
> komutu Lider node  alır, bu komut sadece SET veya GET olarak kabul
> edilir .

    * SET <id> <mesaj> → OK veya ERROR
    
    * GET <id> → mesaj veya ERROR


    * SET <id> <mesaj> → OK veya ERROR
    
    * GET <id> → mesaj veya ERROR

> Lider üye gelen komutları diğer üyeler arasında paylaştırmak ile
> görevlidir, burada `tolerance.conf` içerisindeki değere göre bu işlemi
> gerçekleştirir .


> Burada ki örnekte tolerance değeri 5, bu yüzden gelen her SET komutunu önce Lider node a yazar, ardından da 5 farklı node a dağıtır,
nodeların mesaj miktarı sayısının yaklaşık olarak eşit olduğu gözlemlenebilir .
> 
<img width="1334" height="448" alt="tolerance5" src="https://github.com/user-attachments/assets/15fb6684-e822-4a28-a5bb-cd479a5e5063" />


### 3. Komutların İşleyişi


> **SET** komutu için ;
> 
> 	 TOLERANS değeri kadar üyeye gelen mesaj iletilir,  	 Round - Robin
> kullanılarak bu iletim üyeler arası eşit miktarda  tutulur.
> 
> 	**GET** komutu için ;
> 
>  MessageIndex ile RAM de tutulan değerden,
> hangi mesaj hangi node üzerinde tutulduğu bilgisi alınır. 		-> Bunun
> üzerine ilk olarak **Lider** üzerinden **GET** istenir, eğer **Lider**
> de yok ise, diğer var olan nodelar içerisinden sırasıyla **GET**
> istenir .


