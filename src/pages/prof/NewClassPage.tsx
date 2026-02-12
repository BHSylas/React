import { useState } from "react";
import { api } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

type Language = "en" | "jp" | "de" | "it" | "cn";

export default function NewClassPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [language, setLanguage] = useState<Language>("en");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                title,
                description,
                country,
                language,
            };

            await api.post("/instructor/lectures", payload);

            // 테스트 단계에서는 일단 alert / console 정도로 충분
            alert("Class created successfully");
            navigate("/class");
        } catch (err) {
            console.error(err);
            setError("Failed to create class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 flex flex-col items-center">
            <h1 className="text-5xl font-bold">New Class</h1>

            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <div>
                    <label className="text-xl font-bold">Title</label><br />
                    <input
                        className="w-full text-lg p-2 border rounded-xl border-gray-300"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Class Title"
                    />
                </div>

                <div className="h-auto">
                    <label className="text-xl font-bold">Description</label><br />
                    <textarea
                        className="w-full text-lg p-2 border rounded-xl border-gray-300 h-auto overflow-y-auto resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Class Description"
                    />
                </div>

                <div>
                    <label className="text-xl font-bold">Country</label><br />
                    <input
                        className="w-full text-lg p-2 border rounded-xl border-gray-300"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        placeholder="Country"
                    />
                </div>

                <div>
                    <label className="text-xl font-bold">Language</label><br />
                    <select
                        className="w-full text-lg p-2 border rounded-xl border-gray-300"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                    >
                        <option value="en">English</option>
                        <option value="jp">Japanese</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="cn">Chinese</option>
                    </select>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button className="w-full text-lg mt-8 p-2 border rounded-xl border-gray-300" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Create"}
                </button>
            </form>
        </div>
    );
}