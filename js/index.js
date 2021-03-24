const url = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", function() {
  fetch(`${url}/books`)
    .then(res => res.json())
    .then(books => {
      books.forEach(book => {
        const bookElement = document.createElement('li');
        bookElement.innerHTML = book.title;
        document.getElementById('list').appendChild(bookElement);

        bookElement.addEventListener('click', () => {
          const detailsPane = document.getElementById('show-panel');

          const bookImage = document.createElement('img');
          bookImage.src = book.img_url;
          bookImage.alt = book.title;

          const bookTitle = document.createElement('p');
          bookTitle.innerHTML = `<h3>${book.title}</h3>`;

          const bookSubtitle = document.createElement('p');
          bookSubtitle.innerHTML = `<h4>${book.subtitle}</h4>`;

          const bookDescription = document.createElement('p');
          bookDescription.innerHTML = book.description;

          const bookAuthor = document.createElement('p');
          bookAuthor.innerHTML = `<h4>${book.author}</h4>`;

          const likesList = document.createElement('ul');
          const likeButton = document.createElement('button');

          detailsPane.innerHTML = '';
          detailsPane.appendChild(bookImage);
          detailsPane.appendChild(bookTitle);
          detailsPane.appendChild(bookSubtitle);
          detailsPane.appendChild(bookAuthor);
          detailsPane.appendChild(bookDescription);

          fetch(`${url}/books/${book.id}`)
            .then(res => res.json())
            .then(book => {
              book.users.forEach(user => {
                const userList = document.createElement('li');
                userList.innerHTML = user.username;
                likesList.appendChild(userList);
              });

              likeButton.innerHTML = book.users.find(user => user.id === 1) ? 'UNLIKE' : 'LIKE';
    
              detailsPane.appendChild(likesList);    
              detailsPane.appendChild(likeButton);
            });

          likeButton.addEventListener('click', () => {
            let users = [];
            if (likeButton.innerHTML === 'LIKE') {
              users = [...book.users, {
                id: 1,
                username: 'pouros'
              }];
            } 
            else {
              users = book.users.filter(user => user.id !== 1);
            }

            fetch(`${url}/books/${book.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                users
              })
            }).then(res => res.json())
              .then(book => {
                likesList.innerHTML = '';
                book.users.forEach(user => {
                  const userList = document.createElement('li');
                  userList.innerHTML = user.username;
                  likesList.appendChild(userList);
                });
              });
            
              likeButton.innerHTML = likeButton.innerHTML === 'LIKE' ? 'UNLIKE' : 'LIKE';
          });
        });
      });
    });
});
