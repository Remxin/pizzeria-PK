Dokumentacja i Analiza Wymagań - System Pizzeria Web App
1. Wstęp
Celem projektu jest stworzenie nowoczesnej aplikacji webowej dla pizzerii. System ma za zadanie obsługiwać pełen cykl zamówienia (od klienta do kuchni), zarządzać magazynem oraz dostarczać zaawansowane dane analityczne dla kadry zarządzającej. Wyróżnikiem projektu jest interaktywny kreator pizzy typu "drag & drop".
2. Wymagania Funkcjonalne (Functional Requirements - FR)
Zdefiniowane z podziałem na aktorów systemu (Role).
2.1. Klient (Użytkownik niezalogowany / Zalogowany)
FR_K01: Przeglądanie standardowego menu pizzerii (pizze, napoje, dodatki).
FR_K02: Składanie zamówienia ze standardowego menu (wybór rozmiaru, modyfikacja składników bazowych).
FR_K03: Dostęp do interaktywnego kreatora pizzy.
FR_K03.1: Przeciąganie i upuszczanie (drag & drop) składników na wizualną reprezentację ciasta.
FR_K03.2: Dynamiczna aktualizacja ceny końcowej w oparciu o wybrane składniki i ich ilość.
FR_K03.3: Zapisanie stworzonej kompozycji na koncie użytkownika (wymaga logowania).
FR_K04: Zarządzanie koszykiem (dodawanie, usuwanie, edycja ilości).
FR_K05: Finalizacja zamówienia (podanie danych dostawy/odbioru osobistego) 
FR_KO5: System zwraca przewidywany czas realizacji
FR_K06: Śledzenie statusu własnego zamówienia.
2.2. Pracownik (Obsługa / Kuchnia)
FR_P01: Dostęp do panelu pracowniczego (zabezpieczonego logowaniem).
FR_P02: Podgląd listy aktywnych zamówień w czasie rzeczywistym (Real-time).
FR_P03: Zmiana statusu zamówienia (Nowe -> W przygotowaniu -> Gotowe -> Odebrane -> Zakończone).
FR_P04: Podgląd szczegółów zamówienia (dokładna lista składników, uwagi).
FR_P05: Moduł magazynowy:
FR_P05.1: Dodawanie/edycja/usuwanie (CRUD) dostępnych składników i ich ilości.
FR_P05.2: Otrzymywanie alertów o niskim stanie magazynowym (poniżej zdefiniowanego progu).
FR_P05.3: Automatyczne zdejmowanie składników ze stanu na podstawie sfinalizowanych zamówień.
2.3. Administrator / Właściciel
FR_A01: Pełen dostęp do funkcji Pracownika.
FR_A02: Dostęp do modułu raportowego i analitycznego.
FR_A03: Generowanie raportów sprzedaży (najpopularniejsze pizze, najpopularniejsze/najrzadsze składniki, sprzedaż w ujęciu czasowym).
FR_A04: Analiza rentowności (wyliczanie marży per produkt na podstawie wprowadzonych kosztów hurtowych składników).
FR_A05: Moduł sugestii biznesowych (system rekomenduje promocje na podstawie zalegających składników lub wycofanie nierentownych pozycji).
3. Wymagania Niefunkcjonalne (Non-Functional Requirements - NFR)
NFR_01 (Responsywność): Aplikacja musi poprawnie działać na urządzeniach mobilnych (RWD). Kreator drag&drop musi obsługiwać zdarzenia dotykowe (Touch Events).
NFR_02 (Wydajność w czasie rzeczywistym): Aktualizacja statusów zamówień u klienta i pojawianie się nowych zamówień w panelu pracownika nie może trwać dłużej niż 2 sekundy (wymagane użycie WebSockets / SSE).
NFR_03 (Użyteczność): Kreator pizzy musi płynnie renderować grafikę (wymagane min. 30 FPS podczas przeciągania elementów).
NFR_04 (Bezpieczeństwo): Hasła użytkowników muszą być hashowane (np. bcrypt). Komunikacja oparta o HTTPS. Autoryzacja oparta na tokenach JWT (Role-Based Access Control) - access & refresh tokens.
NFR_05 (Skalowalność): Architektura powinna pozwalać na łatwe oddzielenie warstwy frontendowej od backendowej (architektura klient-serwer / API RESTful).
4. Proponowany Stos Technologiczny (Tech Stack)
Wybór technologii jest zoptymalizowany pod kątem nowoczesnego developmentu i ułatwia podział pracy w zespole studenckim.
Frontend (Aplikacja Kliencka i Panel Admina)
Framework: React.js (z TypeScriptem). Gwarantuje dużą elastyczność i ogromną bazę gotowych bibliotek.
Stylizacja: Tailwind CSS (szybkie budowanie interfejsów) + Shadcn UI (gotowe, dostępne komponenty).
Kreator Pizzy: dnd-kit (nowoczesna biblioteka drag & drop dla React, świetnie radzi sobie z ekranami dotykowymi) lub bezpośrednie użycie HTML5 Canvas API / biblioteki Fabric.js jeśli wizualizacja ma być zaawansowana (obracanie składników, nakładanie warstw).
Zarządzanie stanem: Redux Toolkit lub Zustand.
Backend (API Server)
Framework: Node.js z NestJS (TypeScript). NestJS wymusza dobrą architekturę (kontrolery, serwisy, moduły), co zapobiega powstawaniu tzw. "spaghetti code" w projektach zespołowych. Alternatywa: Python (FastAPI).
Komunikacja Real-Time: Socket.io (obsługa panelu kuchni na żywo).
ORM: Prisma ORM lub TypeORM (łatwe zarządzanie bazą danych z poziomu kodu).
Baza Danych i Infrastruktura
Baza Danych: PostgreSQL. Relacyjna baza danych jest idealna dla tego typu projektu (silne powiązania między zamówieniem, użytkownikiem a stertą małych składników).
Konteneryzacja: Docker (ułatwia uruchomienie projektu każdemu członkowi zespołu bez konfliktów środowiskowych).
5. Koncepcja Architektury Bazy Danych (Kluczowe Encje)
User: id, email, password_hash, role (CLIENT, EMPLOYEE, ADMIN), address.
Product/Pizza: id, name, base_price, image_url.
Ingredient: id, name, unit_cost (cena zakupu - dla rentowności), price_for_client (cena w kreatorze), stock_quantity, alert_threshold, image_url (ikona do drag&drop).
Order: id, user_id, status (ENUM), total_price, created_at.
OrderItem: id, order_id, type (MENU_PIZZA / CUSTOM_PIZZA).
OrderItemIngredient: Tabela łącząca, określająca jakie dokładne składniki weszły w skład konkretnej pizzy w zamówieniu (niezbędne do odjęcia ze stanu i wyliczenia kosztu).
6. Kluczowe Wyzwania Techniczne i Ryzyka (Analiza Ryzyka)
Kreator "Drag & Drop" na urządzeniach mobilnych:
Ryzyko: Standardowe API drag&drop z HTML5 często słabo działa na telefonach.
Rozwiązanie: Zastosowanie biblioteki mapującej zdarzenia dotykowe (np. dnd-kit z odpowiednimi sensorami) lub realizacja tego na elemencie <canvas>.
Synchronizacja stanów magazynowych w warunkach współbieżności:
Ryzyko: Dwa zamówienia spływają w tej samej sekundzie, co może doprowadzić do ujemnego stanu na magazynie (Race conditions).
Rozwiązanie: Zastosowanie transakcji bazodanowych z odpowiednim poziomem izolacji w PostgreSQL.
Złożoność analityki:
Ryzyko: Zapytania obliczające rentowność z całej historii mogą obciążać bazę.
Rozwiązanie: Denormalizacja danych (np. zapisywanie wyliczonego kosztu unit_cost składników bezpośrednio w tabeli historii zamówienia w momencie jego składania, aby zmiana cen hurtowych w przyszłości nie fałszowała starych raportów).

