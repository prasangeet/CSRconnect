import os
import django
import sys

# Add the project's root directory to Python's path
sys.path.append('/home/prakhar/Downloads/CSRconnect/backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from sdgs.models import SDG

# List of all 17 SDGs with details
sdgs_data = [
    {
        'number': 1,
        'name': 'No Poverty',
        'description': 'End poverty in all its forms everywhere.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg',
        'color': '#E5243B'
    },
    {
        'number': 2,
        'name': 'Zero Hunger',
        'description': 'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg',
        'color': '#DDA63A'
    },
    {
        'number': 3,
        'name': 'Good Health and Well-being',
        'description': 'Ensure healthy lives and promote well-being for all at all ages.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg',
        'color': '#4C9F38'
    },
    {
        'number': 4,
        'name': 'Quality Education',
        'description': 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg',
        'color': '#C5192D'
    },
    {
        'number': 5,
        'name': 'Gender Equality',
        'description': 'Achieve gender equality and empower all women and girls.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-05.jpg',
        'color': '#FF3A21'
    },
    {
        'number': 6,
        'name': 'Clean Water and Sanitation',
        'description': 'Ensure availability and sustainable management of water and sanitation for all.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg',
        'color': '#26BDE2'
    },
    {
        'number': 7,
        'name': 'Affordable and Clean Energy',
        'description': 'Ensure access to affordable, reliable, sustainable and modern energy for all.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg',
        'color': '#FCC30B'
    },
    {
        'number': 8,
        'name': 'Decent Work and Economic Growth',
        'description': 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg',
        'color': '#A21942'
    },
    {
        'number': 9,
        'name': 'Industry, Innovation and Infrastructure',
        'description': 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg',
        'color': '#FD6925'
    },
    {
        'number': 10,
        'name': 'Reduced Inequality',
        'description': 'Reduce inequality within and among countries.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg',
        'color': '#DD1367'
    },
    {
        'number': 11,
        'name': 'Sustainable Cities and Communities',
        'description': 'Make cities and human settlements inclusive, safe, resilient and sustainable.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg',
        'color': '#FD9D24'
    },
    {
        'number': 12,
        'name': 'Responsible Consumption and Production',
        'description': 'Ensure sustainable consumption and production patterns.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
        'color': '#BF8B2E'
    },
    {
        'number': 13,
        'name': 'Climate Action',
        'description': 'Take urgent action to combat climate change and its impacts.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        'color': '#3F7E44'
    },
    {
        'number': 14,
        'name': 'Life Below Water',
        'description': 'Conserve and sustainably use the oceans, seas and marine resources for sustainable development.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg',
        'color': '#0A97D9'
    },
    {
        'number': 15,
        'name': 'Life on Land',
        'description': 'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        'color': '#56C02B'
    },
    {
        'number': 16,
        'name': 'Peace, Justice and Strong Institutions',
        'description': 'Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg',
        'color': '#00689D'
    },
    {
        'number': 17,
        'name': 'Partnerships for the Goals',
        'description': 'Strengthen the means of implementation and revitalize the global partnership for sustainable development.',
        'image_url': 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg',
        'color': '#19486A'
    },
]

# Create SDG objects
for sdg_data in sdgs_data:
    SDG.objects.update_or_create(
        number=sdg_data['number'],
        defaults={
            'name': sdg_data['name'],
            'description': sdg_data['description'],
            'image_url': sdg_data['image_url'],
            'color': sdg_data['color']
        }
    )

print(f"Created {len(sdgs_data)} SDG objects")