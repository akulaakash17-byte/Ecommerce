import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import { OFFICE_PHONE, PROPERTY_TYPES } from "../../data/propertyTypes";
import { useLocations } from "../../hooks/useLocations";
import { propertyService } from "../../services/propertyService";
import { resolveImage } from "../../utils/images";

const initialForm = {
  title: "",
  description: "",
  price: "",
  district: "Siddipet",
  mandal: "",
  village: "",
  property_type: "Open Plot",
  land_area: "",
  owner_name: "",
  phone: OFFICE_PHONE,
  is_verified: true,
  status: "available",
};

export default function PropertyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { mandals, villages, loading: locationLoading } = useLocations(form.mandal);

  useEffect(() => {
    if (!isEdit) return;

    let active = true;
    propertyService
      .get(id)
      .then((property) => {
        if (!active) return;
        setForm({
          title: property.title || "",
          description: property.description || "",
          price: property.price || "",
          district: property.district || "Siddipet",
          mandal: property.mandal || "",
          village: property.village || "",
          property_type: property.property_type || "Open Plot",
          land_area: property.land_area || "",
          owner_name: property.owner_name || "",
          phone: property.phone || "",
          is_verified: Boolean(property.is_verified),
          status: property.status || "available",
        });
        setExistingImages(property.images || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const fileNames = useMemo(() => files.map((file) => file.name).join(", "), [files]);

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "mandal" ? { village: "" } : {}),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("existingImages", JSON.stringify(existingImages));
    files.forEach((file) => formData.append("images", file));

    try {
      if (isEdit) {
        await propertyService.update(id, formData);
      } else {
        await propertyService.create(formData);
      }
      navigate("/admin/properties");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card h-96 animate-pulse" />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="eyebrow">{isEdit ? "Edit listing" : "New listing"}</p>
          <h1 className="mt-2 text-3xl font-black">{isEdit ? "Update property" : "Add property"}</h1>
        </div>
        <Link className="btn-secondary" to="/admin/properties">Back to listings</Link>
      </div>

      <form className="card grid gap-5 p-5" onSubmit={submit}>
        <ErrorMessage message={error} />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label" htmlFor="title">Title</label>
            <input className="field" id="title" onChange={(event) => update("title", event.target.value)} required value={form.title} />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="description">Description</label>
            <textarea className="field min-h-36" id="description" onChange={(event) => update("description", event.target.value)} required value={form.description} />
          </div>
          <div>
            <label className="label" htmlFor="price">Price</label>
            <input className="field" id="price" min="0" onChange={(event) => update("price", event.target.value)} required type="number" value={form.price} />
          </div>
          <div>
            <label className="label" htmlFor="property_type">Property type</label>
            <select className="field" id="property_type" onChange={(event) => update("property_type", event.target.value)} value={form.property_type}>
              {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="mandal">Mandal</label>
            <select className="field" id="mandal" onChange={(event) => update("mandal", event.target.value)} required value={form.mandal}>
              <option value="">{locationLoading.mandals ? "Loading..." : "Select mandal"}</option>
              {mandals.map((mandal) => <option key={mandal} value={mandal}>{mandal}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="village">Village</label>
            <select className="field" disabled={!form.mandal || locationLoading.villages} id="village" onChange={(event) => update("village", event.target.value)} required value={form.village}>
              <option value="">{locationLoading.villages ? "Loading..." : "Select village"}</option>
              {villages.map((village) => <option key={village} value={village}>{village}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="land_area">Land area</label>
            <input className="field" id="land_area" onChange={(event) => update("land_area", event.target.value)} placeholder="Example: 267 sq yards" value={form.land_area} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Contact phone</label>
            <input className="field" id="phone" onChange={(event) => update("phone", event.target.value)} required value={form.phone} />
          </div>
          <div>
            <label className="label" htmlFor="owner_name">Owner / agent name</label>
            <input className="field" id="owner_name" onChange={(event) => update("owner_name", event.target.value)} value={form.owner_name} />
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select className="field" id="status" onChange={(event) => update("status", event.target.value)} value={form.status}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            checked={form.is_verified}
            id="is_verified"
            onChange={(event) => update("is_verified", event.target.checked)}
            type="checkbox"
          />
          <label className="text-sm font-bold text-slate-700" htmlFor="is_verified">Mark as verified</label>
        </div>

        {existingImages.length ? (
          <div>
            <p className="label">Existing images</p>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {existingImages.map((image) => (
                <div className="relative overflow-hidden rounded-lg border border-slate-200" key={image}>
                  <img alt="" className="h-28 w-full object-cover" src={resolveImage(image)} />
                  <button
                    className="absolute right-2 top-2 rounded bg-white px-2 py-1 text-xs font-black text-red-700 shadow"
                    onClick={() => setExistingImages((current) => current.filter((item) => item !== image))}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <label className="label" htmlFor="images">Upload images</label>
          <input
            accept="image/*"
            className="field"
            id="images"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files || []))}
            type="file"
          />
          {fileNames ? <p className="mt-2 text-sm font-semibold text-slate-500">{fileNames}</p> : null}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <button className="btn-primary" disabled={saving} type="submit">
            {saving ? "Saving..." : isEdit ? "Update property" : "Create property"}
          </button>
          <Link className="btn-secondary" to="/admin/properties">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
