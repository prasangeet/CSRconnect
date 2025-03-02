import Image from 'next/image';
import React from 'react';

function SDGPage() {
    const data = {
        sdgs: Array.from({ length: 17 }, (_, i) => ({
            id: i + 1,
            picture: `/sdgs/image${i + 1}.png`
        }))
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-left mb-6">Sustainable Development Goals</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.sdgs.map((sdg) => (
                    <div key={sdg.id} className="p-2 bg-white shadow-md rounded-3xl flex justify-center cursor-pointer">
                        <Image src={sdg.picture} alt={`SDG ${sdg.id}`} width={200} height={200} className="object-contain" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SDGPage;
