class ChatClient {

  socket = {}
  notifications = []
  config = {}
  notificationHub = "https://notification-hub-erbzqkglja-ew.a.run.app/"

  constructor(config) {

    /* Default data => Might use for validation */
    this.default = {
      apiKey: "",
      username: "",
      organizationId: "",
    }

    /* Configure */
    if (typeof config === "object") {
      this.config = config;
    }

    const socket = io(this.notificationHub, {
      transports: ['websocket'],
    });
    this.socket = socket;

    socket.on('connect', () => {
      console.log('Socket.io connection established.')
    })

    socket.on('disconnect', () => {
      console.log('Socket.io connection closed.')
    })

  }


  addNotificationBox(containerId) {

    const container = document.getElementById(containerId);

    const signIn = () => {
      return new Promise((resolve, reject) => {
        this.socket.emit('signin', { user: this.config.user, room: this.config.room }, (error, history) => {
          if (error) {
            console.error(error);
            reject(error)
          } else {
            console.log(history);
            this.notifications = history.messages
            resolve(history.messages)
          }
        });
      })
    }


    signIn().then(notifications => {
      container.innerHTML =
        `
        <div class="dropdown custom-dropdown">
            <a href="#" data-toggle="dropdown" class="dropdown-link" aria-haspopup="true" aria-expanded="true">
                <span class="material-icons wrap-icon icon-notifications">notifications</span>
                <span class="number">${notifications.length <= 9 ? notifications.length : "9+"}</span>
            </a>

            <div class="dropdown-menu dropdown-menu-right active" aria-labelledby="dropdownMenuButton" x-placement="bottom-end" style="position: absolute; transform: translate3d(-142px, 35px, 0px); top: 0px; left: 0px; will-change: transform;">
        
                <div class="title-wrap d-flex align-items-center">
                    <h5 class="title mb-0">Notifications</h5>
                    <a class="small ml-auto mark-all" id="readAll">Mark all as read</a>
                </div>
                
                <ul class="custom-notifications">
                    ${notifications.reverse().map((notification) => {
          return (
            `<li id="notification-${notification.uuid}" class="${notification.read.includes(this.config.user) ? '' : 'unread'} pointer">
                <div class="text">
                    <strong>${notification.user}:</strong> 
                    ${notification.text}
                </div>
                <div class="d-flex justify-content-end font-italic">
                  <p class="mb-0 mt-1 notification-date">${this.formatDate(notification.datetime)}</p>
                </div>
            </li>`

          )
        }).join("")
        }
              </ul>
              <p class="text-center m-1 p-0 border-top"><a class="small mark-all mt-2">View All</a></p>
          </div>
      </div>
  
          <style>
  
            .content {
              padding: 7rem 0;
            }
  
            .notification-date {
              color: #989797;
            }
            
            .custom-dropdown .btn:active, .custom-dropdown .btn:focus {
              -webkit-box-shadow: none !important;
              box-shadow: none !important;
              outline: none !important;
            }
            
            .custom-dropdown .btn.btn-custom {
              border: 1px solid #efefef !important;
            }
  
            .mark-all {
              color: #0050a1 !important;
              text-decoration: none !important;
              cursor: pointer !important;
              font-size: 15px !important;
            }

            .pointer {
              cursor: pointer !important;
            }
  
            .mark-all:hover {
              color: #0050a18a !important;
              text-decoration: none !important;
            }
            
            .custom-dropdown .title-wrap {
              padding-top: 5px !important;
              padding-bottom: 15px !important;
              padding-right: 5px !important;
              padding-left: 5px !important;
            }
            
            .custom-dropdown .title {
              
              font-weight: 700 !important;
            }
            
            .custom-dropdown .dropdown-link {
              color: #888 !important;
              display: inline-block !important;
              padding-right: 0px !important;
              position: relative !important;
            }
            
            .custom-dropdown .dropdown-link .number {
              width: 24px !important;
              height: 24px !important;
              line-height: 20px !important;
              border-radius: 50% !important;
              background: red !important;
              position: absolute !important;
             
              top: -10px !important;
              right: -10px !important;
              border: 2px solid #fff !important;
              color: #fff !important;
              text-align: center !important;
            }
            
            .custom-dropdown .dropdown-menu {
              border: 1px solid transparent !important;
              -webkit-box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2) !important;
              box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2) !important;
              margin-top: 0px !important !important;
              padding-top: 0 !important;
              padding-bottom: 0 !important;
              padding: 10px !important;
              opacity: 0 !important;
              left: 0 !important !important;
              -webkit-transition: .3s margin-top ease, .3s opacity ease, .3s visibility ease !important;
              -o-transition: .3s margin-top ease, .3s opacity ease, .3s visibility ease !important;
              transition: .3s margin-top ease, .3s opacity ease, .3s visibility ease !important;
              visibility: hidden !important;
              max-width: 300px !important;
              min-width: 300px !important;

            }
            
            .custom-dropdown .dropdown-menu.active {
              opacity: 1 !important;
              visibility: visible !important;
              margin-top: 10px !important;
            }
            
            .custom-dropdown .custom-notifications {
              list-style: none !important;
              padding: 0 !important;
              margin: 0 !important;
              height: 270px !important;
              overflow-y: auto; !important
              border-bottom: 1px solid #efefef !important;
            }
  
            .custom-dropdown, .custom-notifications {
              -ms-overflow-style: none !important;
              -webkit-overflow-scrolling: touch !important;
            }
  
            .custom-dropdown::-webkit-scrollbar, .custom-notifications::-webkit-scrollbar {
              display: none !important;
            }
            
            .custom-dropdown .custom-notifications > li {
              display: block !important;
  
              margin-bottom: 10px !important;
              border-radius: 10px !important;
            }
            
            .custom-dropdown .custom-notifications > li:last-child {
              margin-bottom: 5px !important;
            }
            
            .custom-dropdown .custom-notifications > li {
              display: block !important;
              padding: 20px !important;
              color: #000000c2 !important;
            }
            
            .custom-dropdown .custom-notifications > li:hover {
              background: #aad4ffd1 !important;
              transition: 0.3s !important;
            }
            
  
            .custom-dropdown .custom-notifications > li > .text {
              margin-top: 0px !important;
            }
            
            .custom-dropdown .custom-notifications > li > .text strong {
              font-weight: 700 !important;
              color: #000 !important;
            }
            
            .custom-dropdown .custom-notifications > li.unread {
              background: #0050a18a !important;
              color: #ffffff !important;
            }
  
            li.unread > div > .notification-date {
              color: #e3e3e3 !important;
            }
  
    
          </style>
          `

      notifications.map(notification => {
        const message = document.getElementById(`notification-${notification.uuid}`);
        message.onclick = () => {
          this.readMessage(notification);
        };
      });

      const readAllButton = document.getElementById("readAll")
      readAllButton.onclick = () => {
        this.readAllMessages()
      }

    })




    /* Message listener */
    this.socket.on('message', (notification) => {
      console.log(notification);
      /* Get notification conntianer */
      const notificationContainer = document.querySelector('.custom-notifications')
      let newNotification = document.createElement("li");
      newNotification.innerHTML = `          <div class="text">
            <strong>${notification.user}:</strong> 
            ${notification.text}
        </div>
        <div class="d-flex justify-content-end font-italic">
          <p class="mb-0 mt-1 notification-date">${this.formatDate(notification.datetime)}</p>
        </div>`
      if (!notification.read.includes(this.config.user)) {
        newNotification.classList.add("unread")
      }

      notificationContainer.insertBefore(
        newNotification,
        notificationContainer.firstChild
      )
    });


    $(function () {
      $('.custom-dropdown').on('show.bs.dropdown', function () {

        var that = $(this);
        setTimeout(function () {
          that.find('.dropdown-menu').addClass('active');
        }, 100);
      });
      $('.custom-dropdown').on('hide.bs.dropdown', function () {
        $(this).find('.dropdown-menu').removeClass('active');
      });

    });
  }

  formatDate(date) {

    const now = new Date();
    const diff = now - new Date(date);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;

    if (diff < minute) {
      return "Just now"
    } else if (diff < hour) {
      return Math.floor(diff / minute) + " min ago";
    } else if (diff < day) {
      return Math.floor(diff / hour) + " hours ago";
    } else if (diff < month) {
      return Math.floor(diff / day) + " days ago";
    } else {
      return Math.floor(diff / month) + " months ago";
    }
  }


  async readMessage(message) {

    if (message.read.includes(this.config.user)) return;

    try {

      const response = await fetch(`${this.notificationHub}readMessage`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: this.config.room,
          user: this.config.user,
          message: message
        }),
      })

      const success = await response.json()

      if (success.success) {
        const notification = document.getElementById(`notification-${message.uuid}`);
        notification.classList.remove("unread")
      }

    }
    catch (err) {
      console.error(err)
    }
  }

  async readAllMessages() {

    try {

      const response = await fetch(`${this.notificationHub}markAllAsRead`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room: this.config.room,
          user: this.config.user,
        }),
      })

      const success = await response.json()


    }
    catch (err) {
      console.error(err)
    }
  }


}