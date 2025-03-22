import React, { useState } from 'react';
import "./Blog.css";
import hobo from '../src/syrian.jpg';

function Blog() {
    const [selectedHamster, setSelectedHamster] = useState(null);

    const hamsters = [
        { id: 1, name: 'Syrian Hamster', image: hobo },
        { id: 2, name: 'Dwarf Hamster', image: 'https://delivery-petsuppliesplus.stylelabs.cloud/api/public/content/AdobeStock_270065630.jpeg?v=d5d407ec' },
        { id: 3, name: 'Roborovski Hamster', image: 'https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2022/07/23/hamster-roborovski.jpeg' }
    ];

    const handleImageClick = (name) => {
        setSelectedHamster(name);
    };

    return (
        <div className="blog">
            <h2>Welcome to the Hamster Blog</h2>
            <p>Welcome to our blog dedicated to hamsters! Here, you'll learn about different hamster breeds, their age, and how to take care of them.</p>
            
            <h3>Hamster Breeds</h3>
            <p>There are several types of hamsters that make great pets. The most popular breeds include:</p>
            <ul>
                <li><strong>Syrian Hamster</strong>: Known for their large size, they are often kept alone in cages.</li>
                <li><strong>Dwarf Hamster</strong>: Smaller and more social, dwarf hamsters can live in pairs or small groups.</li>
                <li><strong>Roborovski Hamster</strong>: Tiny, fast, and very active, they are often best suited for experienced hamster owners.</li>
            </ul>

            <h3>Hamster Breed Gallery</h3>
            <div className="gallery">
                {hamsters.map((hamster) => (
                    <div key={hamster.id}>
                        <img 
                            src={hamster.image} 
                            alt={hamster.name} 
                            onClick={() => handleImageClick(hamster.name)}
                        />
                        <div className={`hamster-name ${selectedHamster === hamster.name ? 'show-name' : ''}`}>
                            {selectedHamster === hamster.name ? hamster.name : ''}
                        </div>
                    </div>
                ))}
            </div>

            <h3>Hamster Age</h3>
            <p>Hamsters typically live for about 2 to 3 years, depending on their breed and how well they are cared for. It's important to monitor their health as they age, and provide them with plenty of mental and physical stimulation.</p>

            <h3>Hamster Care</h3>
            <p>To ensure your hamster is happy and healthy, here are some basic care tips:</p>
            <ul>
                <li><strong>Cage</strong>: Provide a spacious cage with plenty of bedding for burrowing.</li>
                <li><strong>Diet</strong>: Feed them a balanced diet of hamster pellets, fresh vegetables, and small treats.</li>
                <li><strong>Exercise</strong>: Hamsters need exercise, so provide a hamster wheel or other toys to keep them active.</li>
                <li><strong>Grooming</strong>: Hamsters usually groom themselves, but you may need to brush long-haired breeds occasionally.</li>
            </ul>
        </div>
    );
}

export default Blog;
