import "../css/App.css";
export default function TestBoot() {
    return (
        <div className='App'>
            <header className='App-header'>
                <div class='alert alert-primary' role='alert'>
                    <p style={{ display: "none" }} className='d-block'>
                    Bootstrap is now successfully installed 😃
                    </p>
                    <p className='d-none'>
                    Bootstrap is not installed if you can see this 😢
                    </p>
                </div>
            </header>
        </div>
    );
}