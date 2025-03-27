# **CSR Connect** 🌍🤝  

**CSR Connect** is a platform that bridges the gap between **corporate social responsibility (CSR) initiatives** and **academic research** aligned with the **UN Sustainable Development Goals (SDGs)**. It automates the process of mapping CSR activities to relevant SDGs and helps companies connect with research projects for meaningful social impact.  

## **🚀 Features**  

✅ **Automated SDG Classification**: Uses **Google Gemini AI** to classify CSR projects based on their focus areas.  
✅ **PDF Parsing & Data Extraction**: Extracts **text and tabular data** from CSR reports using **pdfplumber**.  
✅ **Admin Portal**: Secure login system to manage CSR projects and classifications.  
✅ **Search & Filtering**: Find CSR projects based on **SDG number, implementing organization, location, and project type**.  
✅ **REST API**: Provides **Django-based API endpoints** for data access and integrations.  
✅ **Modern UI**: Built with **Next.js**, offering a seamless and intuitive user experience.  

---

## **🛠️ Tech Stack**  

| **Technology**   | **Usage**  |
|------------------|-----------|
| **Django** 🐍    | Backend API & ORM |
| **Next.js** ⚛️  | Frontend UI |
| **PostgreSQL** 🗄️ | Database |
| **Google Gemini** 🤖 | AI-based SDG Classification |
| **pdfplumber** 📄 | Extract text & tables from PDFs |
| **RAG (Retrieval-Augmented Generation)** 🔍 | Enhances AI-based document processing |
| **Docker** 🐳 | Containerization (optional) |
| **REST Framework (DRF)** ⚡ | API development |

---

## **📂 Project Structure**  

```
CSR-Connect/
│── backend/                 # Django backend
│   ├── classification/      # AI-based SDG classification service
│   ├── api/                 # Django REST Framework APIs
│   ├── models.py            # Database models
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── urls.py              # API routes
│   ├── settings.py          # Django settings
│── frontend/                # Next.js frontend
│   ├── components/          # UI components
│   ├── pages/               # App pages
│   ├── styles/              # CSS & Tailwind styles
│── docs/                    # Documentation & API references
│── requirements.txt         # Python dependencies
│── package.json             # JavaScript dependencies
│── README.md                # Project documentation
```

---

## **⚙️ Setup & Installation**  

### **🔹 Backend Setup (Django & PostgreSQL)**  

1️⃣ **Clone the repository**  
```bash
git clone https://github.com/your-repo/csr-connect.git  
cd csr-connect/backend
```
  
2️⃣ **Set up a virtual environment**  
```bash
python -m venv venv  
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3️⃣ **Install dependencies**  
```bash
pip install -r requirements.txt
```

4️⃣ **Configure database** *(update settings.py for PostgreSQL)*  
```bash
python manage.py migrate
python manage.py createsuperuser  # Create an admin user
```

5️⃣ **Run the backend server**  
```bash
python manage.py runserver
```

---

### **🔹 Frontend Setup (Next.js)**  

1️⃣ **Move to the frontend directory**  
```bash
cd ../frontend
```

2️⃣ **Install dependencies**  
```bash
npm install
```

3️⃣ **Run the development server**  
```bash
npm run dev
```
  
Now, visit **`http://localhost:3000`** to access the UI.

---

## **📡 API Endpoints**  

### **🔹 Upload CSR PDF for Classification**  
- **Endpoint**: `POST /api/classification/upload_pdf/`  
- **Request**:  
  ```bash
  curl -X POST -F "file=@report.pdf" http://localhost:8000/api/classification/upload_pdf/
  ```
- **Response**:  
  ```json
  {
    "extracted_text": "Extracted content from PDF...",
    "classifications": [
      {
        "implementing_organisation": "XYZ Foundation",
        "sdg_number": "3",
        "sdg_name": "Good Health and Well-being",
        "district": "Mumbai",
        "state": "Maharashtra",
        "project_status": "Ongoing",
        "project_type": "Annual",
        "company_name": "ABC Ltd."
      }
    ]
  }
  ```

### **🔹 Fetch All Classified SDG Projects**  
- **Endpoint**: `GET /api/classification/`  
- **Response**: Returns all classified CSR projects.

### **🔹 Fetch Projects by SDG Number**  
- **Endpoint**: `GET /api/classification/<sdg_number>/`  
- **Response**: Returns CSR projects classified under a specific SDG.

---

## **🔐 Authentication**  

- **Admin Login**: Access Django Admin at **`http://localhost:8000/admin`**.  
- **User Authentication**: JWT-based authentication for API access (optional).  

---

## **🚀 Future Enhancements**  

✅ **Interactive Dashboard**: Data visualization for CSR activities.  
✅ **Company & Research Matching**: AI-powered recommendations.  
✅ **Export & Reports**: Generate CSV/Excel reports of classified CSR projects.  
✅ **User Roles & Permissions**: Separate views for companies & researchers.  

---

## **📜 License**  
This project is licensed under the **MIT License**.

---

## **👨‍💻 Contributing**  
Want to contribute?  

1. **Fork the repo**  
2. **Create a new branch**  
3. **Commit changes**  
4. **Push & open a Pull Request**  

---

## **📞 Contact**  

💼 **Project Owner**:@prasangeet
📧 **Email**: b23ch1033@iitj.ac.in 
🌐 **Website**: prasangeetdongre.vercel.app  

---

This **README** gives a **detailed overview** of your project, from **setup** to **features** and **API usage**. Do you want any modifications or additions? 🚀
