class ChatClient {

    socket = {}
    notifications = []
    config = {}
    notificationHub = "https://notification-hub-erbzqkglja-ew.a.run.app/"
    // notificationHub = "http://localhost:8080/"
    badge = 0

    constructor(config) {

        /* Default data => Might use for validation */
        this.default = {
            token: "",
            user: "",
            room: "",
        }

        /* Configure */
        if (typeof config === "object") {
            this.config = config;
        }

        try {

            const socket = io(this.notificationHub, {
                transports: ['websocket'],
                query: {
                    token: this.config.token
                },
                reconnection: false
            });

            this.socket = socket;

            socket.on('connect', () => {
                console.log('Socket.io connection established.')
            })

            socket.on('disconnect', () => {
                console.log('Socket.io connection closed.')
            })
        }
        catch (error) {
            console.log('Socket.io connection error', error)
        }

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
                        if (history?.messages) {
                            this.notifications = history?.messages
                        }

                        resolve(this.notifications)
                    }
                });
            })
        }


        signIn().then(notifications => {

            /* Get user's unread messages number */
            const unreadNotifications = notifications.filter(notification => {
                return !notification.read.includes(this.config.user);
            });

            this.badge = unreadNotifications?.length

  
            container.innerHTML =
            `
            <div class="notification-box">

                <button class="toggler-notification" id="toggler-notification">
                    <span class="material-icons">notifications</span>
                    <span class='notification-badge ${this.badge > 0 ? "" : "hide"}'>${this.badge > 0 ? this.badge : ""}</span>
                </button>

            <div class="notification-dropdown" id="notification-dropdown">

                <h3 class="notification-header">Notifications</h3>

                <ul class="notification-ul">
               
                    ${notifications?.length ? 
                        (
                            notifications.reverse().map((notification) => {
                                return (
                                    `
                                        <li id="notification-${notification.uuid}">
                                            <div class="dot-container">
                                                <div class="notification-dot ${notification.read.includes(this.config.user) ? '' : 'unread-notification'}"></div>
                                            </div>
                
                                            <div class="notification-info">
                                                <div class="notification-text">
                                                    <span>${notification.text}</span>
                                                </div>
                                                <div class="notification-time">
                                                    <p>${this.formatDate(notification.datetime)}</p>
                                                </div>
                                            </div>
                                        </li>
                                    `
                                )
                            }).join("")
                        )
                        :
                        `<p class="no-notifications">No notifications</p>`
                    }
                </ul>
                </div>
            </div>

            <style>
                .notification-box>* {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                --shadow: rgba(0, 0, 0, 0.05) 0px 6px 10px 0px,
                    rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;
                --gap: 0.5rem;
                --radius: 7px;
                }

                .notification-header {
                margin: 0 !important;
                font-size: 18px !important;
                padding: 1rem 0 0.8rem 1rem !important;
                border-bottom: 1px solid #c5c5c5;
                position: sticky !important;
                top: 0 !important;
                background-color: #fff !important;
                }

                .notification-box {
                font-size: 0.9rem !important;
                color: black !important;
                }

                .toggler-notification {
                all: unset !important;
                display: flex !important;
                align-items: center !important;
                justify-content: flex-start !important;
                column-gap: var(--gap) !important;
                cursor: pointer !important;
                border-radius: var(--radius) !important;
                border: none !important;
                padding: 7px !important;
                position: relative !important;
                }


                .notification-badge {
                position: absolute;
                top: 0px;
                right: 1px;
                background-color: red;
                color: white;
                border-radius: 50%;
                padding: 5px;
                font-size: 12px;
                text-align: center;
                line-height: 0.9;
                min-width: 10px;
                height: 10px;
                }

                .notification-dropdown {
                position: absolute !important;
                margin-top: 0.3rem !important;
                background: white;
                max-width: 360px !important;
                min-width: 360px !important;
                display: none;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.5, 1) !important;
                /* padding: 0.8rem 1rem !important; */
                min-height: 300px !important;
                max-height: 80vh !important;
                overflow-y: auto !important;
                z-index: 10 !important;
                box-shadow: 0px 3px 10px rgb(0 0 0 / 20%) !important;
                border-radius: 10px !important;
                }

                .notification-dropdown>ul {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                }

                .notification-dropdown li {
                display: flex !important;
                padding: 0.9rem 0.8rem !important;
                align-items: center !important;
                text-decoration: none !important;
                color: black;
                border-bottom: 1px solid rgb(221, 221, 221);
                }

                .notification-dropdown li>.dot-container {
                    width: 7% !important;
                }

                .notification-dropdown li>.notification-info {
                width: 93% !important;
                max-width: 93% !important;
                }

                .notification-dot {
                width: 10px !important;
                height: 10px !important;
                border-radius: 50% !important;
                background-color: #1b83ef !important;
                visibility: hidden;
                }

                .unread-notification {
                visibility: visible;
                }

                .notification-dropdown a {
                color: #1b83ef !important;
                }

                .notification-dropdown li:hover {
                background-color: #e9e9e9;
                transition: 0.3s !important;
                }

                .no-notifications {
                  font-size: 17px !important;
                  color: #1f4164d1 !important;
                  width: 100%;
                  text-align: center;
                  margin-top: 31px;
                }

                .notification-text>span {
                width: 100% !important;
                max-width: 100% !important;

                }

                .notification-text>span>* {
                word-wrap: break-word !important;
                }

                .notification-text {
                display: flex;
                width: 100% !important;
                max-width: 100% !important;
                }

                .notification-text>span>p {
                margin: 0 !important;
                }

                .notification-text>strong {
                margin-right: 5px !important;
                }

                .notification-time>p {
                margin: 5px 0 0 0 !important;
                color: #6d6d6d !important;
                font-size: 13px;
                }

                .notification-dropdown {
                -ms-overflow-style: none !important;
                -webkit-overflow-scrolling: touch !important;
                }

                .notification-dropdown::-webkit-scrollbar {
                display: none !important;
                }

                .show {
                display: block;
                opacity: 1;
                transform: translateY(0rem);
                }

                .hide {
                display: none;
                }

                .show-badge {
                display: in-line;
                }
            </style>
        `


            const dropdownBtn = document.getElementById("toggler-notification");
            const dropdownMenu = document.getElementById("notification-dropdown");

            // Toggle dropdown function
            const toggleDropdown = function () {
                const offsetLeft = dropdownBtn.getBoundingClientRect().left;
                const screenWidth = window.innerWidth;

                if (offsetLeft < screenWidth / 2) {
                    dropdownMenu.style.transform = "translateY(0.5rem)"
                } else {
                    dropdownMenu.style.transform = "translate(-16rem, 0.5rem)"
                }

                if (dropdownMenu.classList.contains("show")) {
                    readAllMessages()
                }

                dropdownMenu.classList.toggle("show");

            };

            // Toggle dropdown open/close when dropdown button is clicked
            dropdownBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleDropdown();
            });

            // Close dropdown when dom element is clicked
            document.documentElement.addEventListener("click", function () {

                if (dropdownMenu.contains(event.target)) {
                    return;
                }

                if (dropdownMenu.classList.contains("show")) {
                    toggleDropdown();
                }
            });


            const readAllMessages = async () => {
                try {
                    const response = await fetch(`${this.notificationHub}api/markAllAsRead`, {
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
                    if (success) {

                        /* Hide badge number and make it 0 */
                        const badgeElement = document.querySelector('.notification-badge')
                        this.badge = 0;
                        badgeElement.innerHTML = this.badge;
                        badgeElement.classList.add('hide')

                        /* Select unread messages and remove class */
                        const unreadMessagesContainers = document.querySelectorAll('.unread-notification')
                        unreadMessagesContainers.forEach(unreadMessagesContainers => {
                            unreadMessagesContainers.classList.remove('unread-notification')
                        })

                    }
                }
                catch (err) {
                    console.error(err)
                }
            }

        })


        /* Message listener */
        this.socket.on('message', (notification) => {
            console.log(notification)
            /* Get notification conntianer */
            const notificationContainer = document.querySelector('.notification-ul')
            let newNotification = document.createElement("li");

            /* Set id and class */
            newNotification.id = "notification-" + notification.uuid


      
   

            newNotification.innerHTML =
                `
                <div class="dot-container">
                    <div class="notification-dot unread-notification"></div>
                </div>

                <div class="notification-info">
                    <div class="notification-text">
                        <span>${notification.text}</span>
                    </div>
                    <div class="notification-time">
                        <p>${this.formatDate(notification.datetime)}</p>
                    </div>
                </div>
                `

            const badgeElement = document.querySelector('.notification-badge')
            const noNotifications = document.querySelector('.no-notifications')

            badgeElement.classList.remove('hide')

            if (noNotifications) {
                noNotifications?.classList.add('hide')
            }

            this.badge = Number(this.badge) + 1;
            badgeElement.innerHTML = this.badge;

            notificationContainer.insertBefore(
                newNotification,
                notificationContainer.firstChild
            )
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

}
