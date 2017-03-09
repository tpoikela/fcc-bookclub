fcc-bookclub TODO list
======================

TODO
----

The app/site is developed in stages. 

List of user features:

  0. [X] User can register and login into the site.
  1. [X] User can add books into his/her profile.
  2. [X] User can see a list of all books of all users.
  3. [X] User can remove books from his/her profile.
  4. [X] User can request a trade of certain book.
  5. [X] User can delete any of their requests.
  6. [X] User can view all receiver requests (in modal)
    - [X] Modal should show the books to request back in a trade
    - [ ] User can select any of the books shown.
  7. [ ] User can accept trade requests.
    - [ ] Modify User data when accepted request arrives
    - [ ] Modify Book data when accepted request arrives
  8. [ ] A user can reject trade requests.
    - [ ] Modify User data when accepted request arrives
    - [ ] Modify Book data when accepted request arrives
  9. [ ] A user can search books by name.
  10. [ ] User can see covers of the books in all views
    - [ ] Hook up an external API (Google books)
    - [ ] Hook up an external API (Google books)

The following Database schemas have been setup:

  1. User
  2. Book

Trade requests are added to both objects User and Book as separate objects.

