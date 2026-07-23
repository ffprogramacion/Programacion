FROM python:3.11-slim
# Evita archivos .pyc y muestra los logs directo en consola
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
# Dependencias del sistema (incluye el cliente de PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*
# Instala las dependencias de Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt
# Copia el resto del código
COPY . /app/
EXPOSE 8000
# Arranque de producción con Gunicorn.
# IMPORTANTE: reemplacen 'config' por el nombre de la carpeta que
# contiene su archivo wsgi.py (la que tiene settings.py).
CMD ["sh", "-c", "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]