function slugify(name: string, id: string): string {
    return (
        name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-") +
        "-" +
        id
    );
}

export {slugify};
