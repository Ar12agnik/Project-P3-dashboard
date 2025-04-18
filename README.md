
# 🧩 Project P3 Dashboard (Unified Repo)

This project integrates three separate repositories into one cohesive dashboard application:

- 🧠 **Chatbot Backend** (Python)
- 🔌 **Main API Backend** (ASP.NET Framework)
- 💻 **Frontend Dashboard** (HTML/CSS/JS)

---

## 📦 Included Repositories (as Submodules)

This repo uses Git Submodules to integrate the following:

| Repo Name        | Directory Name     | Link                                                                 |
|------------------|--------------------|----------------------------------------------------------------------|
| .NET Backend     | `backend`          | [dashboard-Dotnet-framework-API](https://github.com/Ar12agnik/dashboard-Dotnet-framework-API) |
| Chatbot Backend  | `chatbot-backend`  | [chatbot](https://github.com/Ar12agnik/chatbot)                      |
| Frontend UI      | `frontend`         | [dashboard-Frontend-part](https://github.com/Ar12agnik/dashboard-Frontend-part) |

---

## 🔁 Auto-Sync Enabled

Whenever any of the sub-repositories are updated, this project automatically updates itself using **GitHub Actions**.

You don't need to manually sync files — just push to the original repos and this one stays up-to-date.

⏰ **Frequency**: Every 30 minutes (cron job)

---

## 📥 How to Clone

To properly clone this repository with all submodules:

```bash
git clone --recurse-submodules https://github.com/Ar12agnik/Project-P3-dashboard.git
```

If you forgot to use `--recurse-submodules`:

```bash
git submodule init
git submodule update
```

---

## 🚀 Getting Started

### 1. Backend (.NET)
- Open `backend/` in Visual Studio 2022+
- Restore NuGet packages
- Run the API

### 2. Chatbot Backend (Python)
```bash
cd chatbot-backend
pip install -r requirements.txt
python app.py
```

### 3. Frontend
```bash
cd frontend
Open index.html in browser
```

---

## 🤝 Contributing

Each repo can be worked on independently. Just push to its origin repo.
This dashboard will update itself on the next GitHub Actions cycle.

---

## 👨‍💻 Author

Built with 💙 by [Agnik Roy](https://github.com/Ar12agnik)  
📬 Twitter: [@agnikroy12](https://twitter.com/agnikroy12) | Instagram: [@agnik.roy12](https://instagram.com/agnik.roy12)

---

## ⭐️ Show Your Support

Give a ⭐️ to each repo if you find this helpful!
