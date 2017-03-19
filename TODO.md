fcc-bookclub TODO list
======================

TODO
----

The app/site is developed in stages. After each stage, there should be a new
useful feature available for the user.

List of user features:

  0. [X] User can register and login into the site.
  1. [X] User can add books into his/her profile.
  2. [X] User can see a list of all books of all users.
  3. [X] User can remove books from his/her profile.
  4. [X] User can request a trade of certain book.
  5. [X] User can delete any of their requests.
  6. [X] User can view all receiver requests (in modal)
    - [X] Modal should show the books to request back in a trade
    - [X] User can select any of the books shown.
  7. [ ] User can accept trade requests.
    - [X] Modify User data when accepted request arrives
    - [ ] Modify Book data when accepted request arrives
  8. [ ] A user can reject trade requests.
    - [X] Modify User data when accepted request arrives
    - [ ] Modify Book data when accepted request arrives
  9. [ ] A user can search all added books by name.
  10. [ ] User can see covers of the books in all views
    - [X] Hook up an external API (Google books)
    - [X] Show book covers on profile view
    - [X] Show book covers on all book view
    - [ ] Show book covers on trade request view
  11. [ ] Anonymous users can view all books
  12. [X] User can see About page with additional info
  13. [ ] When user clicks "Add to Profile" in Profile->Add Book, there is some
      feedback to notify the user of successful add.
  14. [ ] User can see all added books as paginated view, with multiple items
      per one row.
  15. [ ] When user Updates Contact details, add feedback whether operation
      succeeded or failed.

SCSS TODO-list:
---------------

  1. [ ] Pug-views
    - [ ] index
    - [ ] login
    - [ ] login failed
    - [ ] signup
    - [ ] signup success
    - [ ] about
  2. [ ] React-views
    - [ ] Profile
    - [ ] AddBooks
    - [ ] ContactInfo
    - [ ] TradeRequest-modal

The following Database schemas have been setup:

  1. User
    - [X] UserController at server
    - [X] UserController at client
  2. Book
    - [X] BookController at server
    - [X] BookController at client

TradeController on both sides handles acceptance, rejection and addition of new
trade requests. Trade requests are added to both Schema objects User and Book as
separate js-objects.

